import fs from "fs-extra"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const { readJSON, writeJSON } = fs

const productsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/products.json")

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = productsArray => writeJSON(productsJSONPath, productsArray)
