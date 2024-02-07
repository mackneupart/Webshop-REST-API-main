import * as dataModel from "./customers.model.js";
import { Request, Response } from "express";

//POST method to create a customer
export async function postCustomer(req: Request, res: Response) {
  try {
    let newCustomer = req.body;
    await dataModel.createCustomer(newCustomer);
    res.status(201).send('Customer created successfully');
  } catch (error) {
    // res.statusMessage=
    res.status(400).send((error as Error).message);
  }
}

export async function getCustomer(req: Request, res: Response) {
  try {
    let customerId = parseInt(req.params.id);
    let customer = await dataModel.getCustomer(customerId);
    res.json(customer);
  } catch (error) {
    res.status(404).send((error as Error).message);
  }
}

export async function getCustomers(req: Request, res: Response) {
  try {
    let customer = await dataModel.getCustomers();
    res.json(customer);
  } catch (error) {
    res.status(404).send((error as Error).message);
  }
}

export async function getGuestCustomer(req: Request, res: Response) {
  try {
    let customer = await dataModel.findGuest();
    res.json(customer);
  } catch (error) {
    res.status(404).send((error as Error).message);
  }
}
