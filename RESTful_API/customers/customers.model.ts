import * as fs from "fs";
import { createBasket, BasketInterface, getBasketFile } from "../baskets/baskets.model"
const CUSTOMERS_FILE = "./data/customers.json"

//Types for JSON objects
export interface CustomerInterface {
  customerId: number;
  firstName: String;
  lastName: String;
  email: String;
  basketId: number;
  password: String;
}

// return all data from file
export async function getCustomersFile() {
  try {
    let dataTxt = await fs.readFileSync(CUSTOMERS_FILE, "utf-8");
    let data = JSON.parse(dataTxt);
    return data;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // file does not exits
      await saveDefaultArray([]); // create a new file with empty array
      return []; // return empty array
    } // // cannot handle this exception, so rethrow
    else throw err;
  }
}
// saves an empty array to data.JSON if array does not exist
async function saveDefaultArray(data = []) {
  let dataTxt = JSON.stringify(data);
  fs.writeFileSync(CUSTOMERS_FILE, dataTxt)
}

// Checks if customer with specific ID exists
export function findCustomer(customerArray: Array<CustomerInterface>, Id: number) {
  return customerArray.findIndex(
    (currCustomer) => currCustomer.customerId === Id
  );
}

//generate a new ID for customer
function getCustomerID(customerArray: Array<CustomerInterface>) {
  let newId: number = 1;
  customerArray.forEach(element => {
    if (element.customerId >= newId) {
      newId = element.customerId + 1;
    }
  });
  return newId;
}

//Saves a customer to data.JSON
async function saveCustomer(customer: CustomerInterface) {
  let existingData = fs.readFileSync(CUSTOMERS_FILE, "utf-8");
  let existingCustomers = JSON.parse(existingData);
  existingCustomers.push(customer);
  let updatedData = JSON.stringify(existingCustomers);
  fs.writeFileSync(CUSTOMERS_FILE, updatedData);
}

// create a new customer with unique customerID and basketID
export async function createCustomer(newCustomer: CustomerInterface) {
  let customerArray: Array<CustomerInterface> = await getCustomersFile();
  //generates new customerID
  let newCustomerId: number = getCustomerID(customerArray);
  newCustomer.customerId = newCustomerId;
  //generates new basketID
  let basketArray: Array<BasketInterface> = await getBasketFile();
  let newBasketId: number = createBasket(basketArray);
  newCustomer.basketId = newBasketId;
  //check if customer already exists
  if (findCustomer(customerArray, newCustomer.customerId) !== -1)
    throw new Error(
      `Customer with Id:${newCustomer.customerId} already exists`
    );
  await saveCustomer(newCustomer);
}

export async function getCustomerObject(id: number): Promise<CustomerInterface | undefined> {
  const customerArray: Array<CustomerInterface> = await getCustomersFile();
  const customerObject: CustomerInterface | undefined = customerArray.find((customer: CustomerInterface) => customer.customerId === id);
  return customerObject;
}

export async function getCustomer(customerId: number) {
  const customerArray: Array<CustomerInterface> = await getCustomersFile();
  let customer: CustomerInterface | undefined = customerArray.find((customer) => customer.customerId === customerId);
  if (customer !== undefined) {
    return customer
  } else {
    throw new Error(`Customer doesn't exist`);

  }
}

//return all customers
export async function getCustomers() {
  let customerArray = await getCustomersFile();
  return customerArray;
}

// Checks if customer with specific ID exists
export async function findGuest() {
  let customerArray = await getCustomersFile();

  const guestCustomer = customerArray.find(
    (currCustomer: { firstName: string; }) => currCustomer.firstName === "Guest"
  );
  return guestCustomer;
}
