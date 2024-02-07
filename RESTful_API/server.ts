import { customersRouter } from "./customers/customers.route"
import { basketsRouter } from "./baskets/baskets.route.js";
import { categoriesRouter } from "./categories/categories.route.js";
import { productsRouter } from "./products/products.route.js";
import express, { Express, Request, Response } from "express";
import cors from "cors";
var corsVar = require('cors');

const app: Express = express();
const port = 3000;

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads.
app.use(cors()) // simple use

// CORS configuration 
app.options('*', corsVar({
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token'
  ],
  credentials: false,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: "*",
  preflightContinue: true,
}))

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads.
app.use(express.json());

// paths '/customer' are handled by customerRouter
app.use(customersRouter, basketsRouter, categoriesRouter, productsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

