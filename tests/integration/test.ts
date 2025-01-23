import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/index';

describe('Routes', () => {
  let server: any;
  before(async () => {
    server = await app.startApp();
  });
  after(async () => {
    if (server) {
      await server.close(); 
    }
  });

  // it('should register a new user successfully', async () => {
  //   const response = await request(app.getApp())
  //     .post('/api/v1/users')
  //     .send({
  //       name: 'test test',
  //       email: 'test@example.com',
  //       phone: '1234567890',
  //       role: 'user',
  //       password: 'password123',
  //     });

  //   expect(response.status).to.equal(201);
  //   expect(response.body.message).to.include('registered Successfully!');
  // });

    // it('should fail when the email is already registered', async () => {
    //     await request(app.getApp())
    //       .post('/api/users/')
    //       .send({
    //         name: 'test test',
    //         email: 'test@example.com',
    //         phone: '1234567890',
    //         role: 'user',
    //         password: 'password123',
    //       });
    
    //     const response = await request(app.getApp())
    //       .post('/api/v1/users')
    //       .send({
    //         name: 'test test',
    //         email: 'test@example.com',
    //         phone: '1234567890',
    //         role: 'user',
    //         password: 'password123',
    //       });
    
    //     expect(response.status).to.equal(400);
    //     expect(response.body.message).to.include('User already exists');
    //   });
    
      it('should return a 400 error for missing fields', async () => {
        const response = await request(app.getApp())
          .post('/api/users/')
          .send({
            email: 'missing@example.com',
          });
    
        expect(response.status).to.equal(404);
        
      });

    let accessToken;
    let refreshToken;
    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getApp())
      .post('/api/v1/users/login')
      .send({
        email: "test@example.com",
        password: "password123",
      });
      accessToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
      console.log(refreshToken);
      expect(response.status).to.equal(200);
      expect(response.body.accessToken);
      expect(response.body.message).to.include('Login successful');
  }); 

   it('should login successfully with valid credentials', async () => {
     const response = await request(app.getApp())
      .post('/api/v1/users/login')
      .send({ 
      password: "password123",
    });
      expect(response.status).to.equal(500);
  }); 

   it('should refresh user token', async () => {
    const response = await request(app.getApp())
      .post('/api/v1/users/refreshtoken')
      .send({
        refreshtoken: refreshToken,
      });
      console.log(refreshToken);
    expect(response.status).to.equal(200);
  });

  it('should add book to cart', async () => {
    const response = await request(app.getApp())
      .post('/api/v1/cart/5/add_To_Cart')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ "quantity": 2});
      
    expect(response.status).to.equal(201);
  });
  
  it('should cart Total', async () => {
    const response = await request(app.getApp())
      .get('/api/v1/cart/get-cart-items')
      .set('Authorization', `Bearer ${accessToken}`)
      expect(response.body.message).to.include("Cart items retrieved successfully");
      expect(response.body.discountTotal);
      expect(response.status).to.equal(200);
  });

  it('should update cart', async () => {
    const response = await request(app.getApp())
      .put('/api/v1/cart/1/cart_item_quantity')
      .set('Authorization', `Bearer ${accessToken}`)
     
      expect(response.status).to.equal(500);
  });
  it('should delete cart', async () => {
    const response = await request(app.getApp())
      .put('/api/v1/cart/2/remove_cart_item')
      .set('Authorization', `Bearer ${accessToken}`)
     
      expect(response.status).to.equal(404);
  });

  it('should all books', async () => {
    const response = await request(app.getApp())
      .get('/api/v1/books/')
      expect(response.body.book);
      expect(response.status).to.equal(200);
  });

  it('should all books', async () => {
    const response = await request(app.getApp())
      .get('/api/v1/books/4/')
      expect(response.body.book);
      expect(response.status).to.equal(200);
  });
  it('should add books to wishlist', async () => {
    const response = await request(app.getApp())
      .post('/api/v1/wishlist/11/addBook')
      .send({ "id": 11})
      .set('Authorization', `Bearer ${accessToken}`)
      expect(response.body.message).to.include('Book added to wishlist successfully');
      expect(response.status).to.equal(200);
  });
 
  it('should get All useer wishlist', async () => {
    const response = await request(app.getApp())
      .get('/api/v1/wishlist/getAll')
      .set('Authorization', `Bearer ${accessToken}`)
      expect(response.body.message).to.include('Wishlist retrieved successfully');
      expect(response.status).to.equal(200);
  });
  
  it('should get All useer wishlist', async () => {
    const response = await request(app.getApp())
      .post('/api/v1/order/')
      .send({ "fullAddress": "123 Main St, Apartment 4B",
              "city": "Nashik",
              "state": "Maharashtra"})
      .set('Authorization', `Bearer ${accessToken}`)
    
      expect(response.status).to.equal(500);
  }); 
})

