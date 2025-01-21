import swaggerJSDoc from "swagger-jsdoc";
import express ,{Request, Response} from 'express';
import Logger from "../config/logger";
import SwaggerUi from "swagger-ui-express";

const logger= Logger.logger;
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "E-BookStore",
            version: "1.0.0",
            description: "API documentation for E-BookStore.",
          },
    
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
      apis: ["./src/routes/*.ts"],
    
};
const swaggerSpec = swaggerJSDoc(options);
function swaggerDocs(app: express.Application, port: string | number, host: string | number) {
    app.use("/docs", SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));
    app.get("/docs.json", (req: Request, res: Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });
    logger.info(`Swagger Docs available at ${host}:${port}/docs`);  }
  export default swaggerDocs;