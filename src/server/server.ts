import dotenv from 'dotenv';
import express from 'express';
const cors = require('cors');

class Server {
  public app: any;
  constructor(app: express.Application) {
    this.app = app;
  }

  public config() {
    dotenv.config({ path: '.env' });
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: false,
      })
    );

    this.configureCors();
  }

  private configureCors() {
    let allowedOrigins = JSON.parse(process.env.CORS);

    this.app.use(
      cors({
        origin: (origin, callback) => {
          // allow requests with no origin
          // (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
          if (allowedOrigins.indexOf(origin) === -1) {
            let msg = 'Hubo un problema de CORS';
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
      })
    );
  }
}

export default Server;
