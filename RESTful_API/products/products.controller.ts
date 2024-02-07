import * as dataModel from "./products.model.js";
import { Request, Response } from "express";

//GET method to retrieve all products
export async function getAllProducts(req:Request, res:Response) {
  try {
    let allProducts = await dataModel.getAllProducts();
    res.json(allProducts);
  } catch (error: unknown){
    // res.statusMessage=
    res.status(400).send((error as Error).message);
  }
}

// GET method to retrieve specific product
export async function getProduct(req:Request, res:Response) {
  try {
    let id = parseInt(req.params.id);
    let customer = await dataModel.getProductByID(id);
    res.json(customer);
  } catch (error) {
    // res.statusMessage=
    res.status(400).send((error as Error).message);
  }
}

//GET method to retrieve new products
export async function getNewlyAddedProducts(req:Request, res:Response){
  try{
    let newProducts = await dataModel.getNewlyAddedProducts();
    res.json(newProducts);
  } catch (error) {
    // res.statusMessage=
    res.status(400).send((error as Error).message);
  }
}