import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import sequelize, { DataTypes } from '../config/database';
import { sendPasswordResetToken } from '../utils/mail.util';
import { sendToQueue } from '../utils/rabbitMQ';
sendToQueue
class UserService {
  private User = User(sequelize, DataTypes);
  public newUser = async (body) => {
    try {
      const exist = await this.User.findOne({ where: { email: body.email } });
      if (exist) {
        throw new Error('User already exists');
      }
  
      body.password = await bcrypt.hash(body.password, 10);
      const data = await this.User.create(body);
      if (!data) {
        throw new Error('Registration failed');
      }
      const transformedData = {
        name: data.name,
        email:data.email,
        phone:data.phone,
        role:data.role,
        password:data.password,
        refreshToken:data.refreshToken,
      };
      await sendToQueue('userQueue', transformedData);
      return {
        message: 'Registration successful',
      };
    } catch (error) {
      throw new Error(`Error during registration: ${error.message}`);
    }
  };
  

  //Refresh token
  public refreshToken = async (req, res) => {
    const { refreshtoken } = req.body;
    if (!refreshtoken) {
      res.status(400).json({
        message: "refreshtoken required"
      });
    }
    jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH, async (error, decoded) => {
      if (error) {
        res.status(404).json({
          message: "invalid refreshtoken"
        });
      }

      const user = await this.User.findOne({ where: { id: decoded.id, role:decoded.role, refreshToken: refreshtoken } });
      if (!user) {
        res.status(404).json({
          message: "refreshtoken not found in database"
        });
      }

      const newToken = jwt.sign({ email: decoded.email ,role:decoded.role ,id: decoded.id}, process.env.JWT_SECRET_ACCESS, { expiresIn: '1h' });
      res.status(200).json({
        newToken: newToken
      });
    });
  }

  //Login
  public userLogin = async (body) => { 
    try {
      const data = await this.User.findOne({ where: {email:body.email } });
      if (!data) {
        return {
          message: 'User not found',
        };
      }
      const match = await bcrypt.compare(body.password, data.password);
      if (!match) {
        return {
          message: 'Invalid password',
        };
      }
     
      const accessToken = jwt.sign(
        {  email: data.dataValues.email, role:data.dataValues.role, id: data.dataValues.id},
        process.env.JWT_SECRET_ACCESS, 
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION } 
      );

      const refreshToken = jwt.sign(
        {  email: data.dataValues.email,  role:data.dataValues.role, id: data.dataValues.id },
        process.env.JWT_SECRET_REFRESH, 
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION } 
      );
      await this.User.update({ refreshToken }, { where: { id: data.dataValues.id } });
      return {accessToken,refreshToken, message: 'Login successful',}; 

    } catch (error) {
      throw new Error(`Error during login: ${error.message}`);
    }
  };

  // Forgot password service
public forgotPassword = async ({ email }): Promise<void> => {
  const user = await this.User.findOne({ where: { email } });
  if (!user) {
      throw new Error('User not found');
  }

  if (!user.dataValues.email) {
      throw new Error('User email is not defined or invalid');
  }

  const token = await jwt.sign(
      { userId: user.dataValues.id, role: user.dataValues.role, email: user.dataValues.email },
      `${process.env.JWT_SECRET_ACCESS}`,
      { expiresIn: '1d' }
  );

  try {
      console.log('Recipient Email:', token); // Debugging
      await sendPasswordResetToken(user.dataValues.email, token);
  } catch (error) {
      console.error('Error sending email:', error);
      throw error;
  }
};

  
  //reset user password
  public resetPassword = async({newPassword, email}): Promise<void> =>{
    const password = await bcrypt.hash(newPassword, 10);
    const update = await this.User.update({password},{where:{email}});
    if(!update){
      throw Error('could not update password');
    }
  }
}

export default UserService;
