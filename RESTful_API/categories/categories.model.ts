import * as fs from "fs";
import { getProductByID } from "../products/products.model"
const CATEGORIES_FILE = "./data/categories.json"

interface OverCategoryInterface{
  overCategoryName: String;
  ocId: Number;
  subCategories: Array<object>
}


// return all data from file
export async function getCategoriesFile() {
  try {
    let dataTxt = await fs.readFileSync(CATEGORIES_FILE, "utf-8");
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
  fs.writeFileSync(CATEGORIES_FILE, dataTxt)
}

//return all categories
export async function getAllCategories() {
  let categoryArray:OverCategoryInterface = await getCategoriesFile();
  return categoryArray;
}

//return all over categories without sub categories
export async function getAllOverCategories() {
  let categoryArray = await getCategoriesFile();

  let outputCategoryArray:OverCategoryInterface = categoryArray.categories.map((category: { overCategoryName: String; ocId: Number; imgSrc: String; priceRange: String;  }) => {
    return {
      overCategoryName: category.overCategoryName,
      ocId: category.ocId,
      imgSrc: category.imgSrc,
      priceRange: category.priceRange
    };
  });

  return outputCategoryArray;
}

//return all subcategories from a specific overcategory ID
export async function getOverCategoryByOcID(ocId: number) {
  let categoryArray = await getCategoriesFile();

  let filteredCategory = categoryArray.categories.find((category: { ocId: number; }) => {
    return category.ocId === ocId;
  });

  if (filteredCategory) {
    let outputCategory = filteredCategory.subCategories.map((subCategory: { subcId: Number; subCategoryName: String; imgSrc: String; priceRange: String; productsIds: Array<Number>; }) => {
      return {
        subcId: subCategory.subcId,
        subCategoryName: subCategory.subCategoryName,
        imgSrc: subCategory.imgSrc,
        priceRange: subCategory.priceRange,
        productsIds: subCategory.productsIds
      };
    });

    return {
      overCategoryName: filteredCategory.overCategoryName,
      ocId: filteredCategory.ocId,
      subCategories: outputCategory
    };
  } else {
    throw new Error('overcategory does not exist');
  }
}

// Returns all products associated to subcategory
export async function getProductsBySubCategory(ocID: number, subcId: number) {
  let overCategory = await getOverCategoryByOcID(ocID);
  let subCategory;
  if (overCategory != null) {
    subCategory = overCategory.subCategories.find((sub:any) => sub.subcId === subcId);
  }
  if (!subCategory) {
    throw new Error('Overcategory or Subcategory does not exist');
  }

  let productsArray = await Promise.all(
    subCategory.productsIds.map((productId: number) => getProductByID(productId))
  );

  // Remove the 'description' field from each product object
  productsArray = productsArray.map(({ productDescription, ...rest }) => rest);

  subCategory.products = productsArray;

  return subCategory.products;
}
