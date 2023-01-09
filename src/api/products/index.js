import express from "express"
import createHttpError from "http-errors"
import multer from "multer"
import { extname } from "path"
import {
  saveNewProduct,
  findProducts,
  findProductById,
  findProductByIdAndUpdate,
  findProductByIdAndDelete,
} from "../../lib/db/tools.js"
import { saveProductsPictures } from "../../lib/fs/tools.js"

const { NotFound } = createHttpError

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const id = await saveNewProduct(req.body)
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await findProducts()
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await findProductById(req.params.productId)
    if (product) {
      res.send(product)
    } else {
      next(NotFound(`Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await findProductByIdAndUpdate(req.params.productId, req.body)

    if (updatedProduct) {
      res.send(updatedProduct)
    } else {
      next(NotFound(`Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await findProductByIdAndDelete(req.params.productId)

    if (updatedProduct) {
      res.status(204).send()
    } else {
      next(NotFound(`Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.patch(
  "/:productId/image",
  multer().single("productPicture"),
  async (req, res, next) => {
    try {
      /*     console.log(req.body)
      await saveNewProduct({...req.body, imageUrl: `/img/products/${filename}` })
      await saveProductsPictures(req.file.buffer, filename) */
      console.log(req.file)
      // 1. Create a unique name for that picture (something like productId.png)
      const filename = req.params.productId + extname(req.file.originalname)

      // 2. Update the product record with the image url
      const product = await findProductByIdAndUpdate(req.params.productId, {
        imageUrl: `/img/products/${filename}`,
      })

      if (product) {
        // 3. Save the file into the public folder
        await saveProductsPictures(req.file.buffer, filename)
        res.send(product)
      } else {
        next(NotFound(`Product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  }
)

export default productsRouter
