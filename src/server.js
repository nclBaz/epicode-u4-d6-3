import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import productsRouter from "./api/products/index.js"

const server = express()
const port = 3001

// ******************************************************** MIDDLEWARES ******************************************
server.use(cors())
server.use(express.json())

// ********************************************************* ENDPOINTS *******************************************
server.use("/products", productsRouter)

// ****************************************************** ERROR HANDLERS *****************************************

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})
