import express from 'express';
import Server from './server/server';
import * as MySQLConnector from './server/mysql.connector';
import Routes from './routes';

const app: express.Application = express();
new Server(app).config();

// create database pool
MySQLConnector.init();

const port = process.env.PORT || 5000;

let router: express.Router;
router = express.Router();

Routes.indexRoutes(router);
app.use('/api', router);

app.listen(port, () => {
  console.log(`App running in port ${port}`);
});
