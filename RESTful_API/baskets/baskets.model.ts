import * as fs from "fs";
import { getProductByID, ProductInterface } from "../products/products.model";
import { getCustomerObject } from "../customers/customers.model";
import { CustomerInterface } from "../customers/customers.model";
const BASKETS_FILE = "./data/baskets.json";

//Types for JSON objects
export interface BasketInterface{
basketId: number;
productIds: Array<number>;
}

// return all data from file
export async function getBasketFile() {
  try {
    let dataTxt = await fs.readFileSync(BASKETS_FILE, "utf-8");
    let data = JSON.parse(dataTxt);
    return data;
  } catch (err:any) {
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
  fs.writeFileSync(BASKETS_FILE, dataTxt)
}


//generate a new ID for basket
function getBasketID(basketArray: Array<BasketInterface>) {
  let newId:number = 1;
  basketArray.forEach(element => { 
    if (element.basketId >= newId) {
      newId = element.basketId + 1;
    }
  });
  return newId;
}

//Saves a basket to data.JSON
async function saveBasket(newBasketId:number) {
  let existingData = fs.readFileSync(BASKETS_FILE, "utf-8");
  let existingBaskets = JSON.parse(existingData);
  let newBasket: BasketInterface = { basketId: newBasketId, productIds:[]}
  existingBaskets.push(newBasket);
  let updatedData = JSON.stringify(existingBaskets);
  fs.writeFileSync(BASKETS_FILE, updatedData);
}

//creates a new basket with unique ID
export function createBasket(basketArray: Array<BasketInterface>) {
  let newBasketId = getBasketID(basketArray);
  saveBasket(newBasketId);
  return newBasketId;
}

export async function getBasketObject(id: number | undefined): Promise<BasketInterface | undefined> {
  const basketArray: Array<BasketInterface> = await getBasketFile();
  const basketObject: BasketInterface | undefined = basketArray.find((basket: BasketInterface) => basket.basketId === id);
  return basketObject;
}



//Saves product in JSON to a customer's respective basket
async function saveProductToBasket(customerBasketId:number|undefined, productId: number|undefined){
  //Saves a customer to data.JSON
  const existingData = fs.readFileSync(BASKETS_FILE, "utf-8");
  const existingBaskets = JSON.parse(existingData);
  existingBaskets.forEach((basket: { basketId: number | undefined; productIds: (number | undefined)[]; }) => {
    if (basket.basketId === customerBasketId) {
     basket.productIds.push(productId)
   }
  });

  const updatedData = JSON.stringify(existingBaskets);
  fs.writeFileSync(BASKETS_FILE, updatedData);
}


//Adds a product to a customers basket
export async function addProductToBasket(customerId: number, productId: number) {  
  const productObject = await getProductByID(productId);  
  const productObjectID = productObject?.productId;
  const customerObject: CustomerInterface | undefined = await getCustomerObject(customerId);
  let customerBasketId = customerObject?.basketId;
  if (customerBasketId !== undefined) {
    saveProductToBasket(customerBasketId, productObjectID)
  }else {
    throw new Error(
      `Customer with Id:${customerId} does not exist.`
    );
  }
}

async function getProductArray(customerBasketId:number){
  const basketArray: Array<BasketInterface> = await getBasketFile();
  const customerBasket: BasketInterface | undefined = basketArray.find((currBasket: any) => currBasket.basketId === customerBasketId);
  if (customerBasket !== undefined) {
    const productIdsArray = customerBasket.productIds;
    return productIdsArray
  } else {
    return []
  }
}

export async function getBasketProducts(customerId: number) {
  let productArray: ProductInterface[] = [];
  const customerObject: CustomerInterface | undefined = await getCustomerObject(customerId); 
  const customerBasketId = customerObject?.basketId;

  if (customerBasketId !== undefined) {
    const productIdsArray = await getProductArray(customerBasketId);    
    for (const productId of productIdsArray) {
      const product = await getProductByID(productId);
      productArray.push(product);
    }
    return productArray;
  } else {
    throw new Error(
      `Basket with Id:${customerBasketId} does not exist`
    );
  }
}

export async function removeProduct(customerId: number, productId: number) {
  const productObject = await getProductByID(productId);  
  const productObjectID = productObject?.productId;
  const customerObject: CustomerInterface | undefined = await getCustomerObject(customerId);
  let customerBasketId = customerObject?.basketId;
  if (customerBasketId !== undefined) {
    removeProductFromBasket(customerBasketId, productObjectID)
  }else {
    throw new Error(
      `Customer with Id:${customerId} does not exist`
    );
  }
}

async function removeProductFromBasket(customerBasketId: number | undefined, productId: number | undefined) {
  const existingData = fs.readFileSync(BASKETS_FILE, "utf-8");
  const existingBaskets = JSON.parse(existingData);
  existingBaskets.forEach((basket: { basketId: number | undefined; productIds: (number | undefined)[]; }) => {
    if (basket.basketId === customerBasketId) {
      const index = basket.productIds.indexOf(productId);
      if (index !== -1) {
        basket.productIds.splice(index, 1);
      }
    }
  });
  fs.writeFileSync(BASKETS_FILE, JSON.stringify(existingBaskets));
}


export async function removeAllProducts(customerId: number) {
  const customerObject: CustomerInterface | undefined = await getCustomerObject(customerId);
  let customerBasketId = customerObject?.basketId;
  if (customerBasketId !== undefined) {
    removeAllProductFromBasket(customerBasketId);
  }else {
    throw new Error(
      `Customer with Id:${customerId} does not exist`
    );
  }
}

async function removeAllProductFromBasket(customerBasketId: number | undefined) {
  const existingData = fs.readFileSync(BASKETS_FILE, "utf-8");
  const existingBaskets = JSON.parse(existingData);
  existingBaskets.forEach((basket: { basketId: number | undefined; productIds: (number | undefined)[]; }) => {
    if (basket.basketId === customerBasketId) {
      basket.productIds = [];
    }
  });
  fs.writeFileSync(BASKETS_FILE, JSON.stringify(existingBaskets));
}