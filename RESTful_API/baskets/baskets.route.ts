// index.js
import express from "express";
import { addProductToBasket, getBasketProducts, removeAllProducts, removeProduct } from "./baskets.controller.js";

export const basketsRouter = express.Router();

// middleware specific to this route
basketsRouter.use(express.json());

// route handlers
basketsRouter.put('/baskets/:customerid/:productid', addProductToBasket);
basketsRouter.get('/baskets/:customerid', getBasketProducts)
basketsRouter.delete('/baskets/:customerid', removeAllProducts)
basketsRouter.delete('/baskets/:customerid/:productid', removeProduct)