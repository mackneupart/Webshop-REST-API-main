import * as dataModel from "./baskets.model.js";
import { Request, Response } from "express";

// POST method to add specific product to a Customer's basket
export async function addProductToBasket(req: Request, res: Response) {
    try {
        let customerId = parseInt(req.params.customerid);
        let productId = parseInt(req.params.productid);        
        await dataModel.addProductToBasket(customerId, productId);
        res.end();
        
    } catch (error) {
      // res.statusMessage=
      res.status(400).send((error as Error).message);
    }
}

export async function removeProduct(req: Request, res: Response) {
  try {
      let customerId = parseInt(req.params.customerid);
      let productId = parseInt(req.params.productid);        
      await dataModel.removeProduct(customerId, productId);
      res.end();
      
  } catch (error) {
    // res.statusMessage=
    res.status(400).send((error as Error).message);
  }
}
  
export async function getBasketProducts(req: Request, res: Response) {
    try {
        let customerId = parseInt(req.params.customerid);
        let basket = await dataModel.getBasketProducts(customerId);
        res.json(basket);
      } catch (error) {
        // res.statusMessage=
        res.status(400).send((error as Error).message);
      }
}

export async function removeAllProducts(req: Request, res: Response) {
  try {
      let customerId = parseInt(req.params.customerid);     
      await dataModel.removeAllProducts(customerId);
      res.end();
      
  } catch (error) {
    // res.statusMessage=
    res.status(400).send((error as Error).message);
  }
}
  