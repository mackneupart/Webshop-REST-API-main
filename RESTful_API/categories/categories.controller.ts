import * as dataModel from "./categories.model.js";
import { Request, Response } from "express";


//GET method to retrieve all categories
export async function getCategories(req:Request, res:Response) {
  try {
    let allCategories = await dataModel.getAllCategories();
    res.json(allCategories);
  } catch (error) {
    // res.statusMessage=
    res.status(400).send((error as Error).message);
  }
}

//GET method to retrieve all over categories
export async function getOverCategories(req:Request, res:Response) {
  try {
    let allOverCategories = await dataModel.getAllOverCategories();
    res.json(allOverCategories);
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
}

//GET method to retrieve a specific over category
export async function getOverCategoryByOcID(req:Request, res:Response) {
  try {
    let OcId = parseInt(req.params.ocID);
    let Overcategory = await dataModel.getOverCategoryByOcID(OcId);
    res.json(Overcategory);
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
}

//GET method to retrieve all products within a specific sub category
export async function getProductsBySubCategory(req:Request, res:Response) {
  try {
    let ocID = parseInt(req.params.ocID);
    let subCatID = parseInt(req.params.subID);
    let productsFromSub = await dataModel.getProductsBySubCategory(ocID, subCatID);
    res.json(productsFromSub);
  }
  catch (error) {
    res.status(400).send((error as Error).message);
  }
}