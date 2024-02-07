import express from "express";
import { getAllProducts, getNewlyAddedProducts, getProduct} from "./products.controller.js";
export const productsRouter = express.Router();

// middleware specific to this route
productsRouter.use(express.json());

// route handlers
productsRouter.get("/products", getAllProducts);
productsRouter.get("/products/carrousel", getNewlyAddedProducts);
productsRouter.get("/products/:id", getProduct);
