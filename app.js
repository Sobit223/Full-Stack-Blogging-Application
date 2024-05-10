import express from "express"
import cors from "cors"
import { databaseConnection } from "./src/DB/index.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

const app = express()
dotenv.config()
app.use(cors({origin:process.env.ORIGIN, credentials:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


databaseConnection().then((res)=> {
    app.listen(process.env.PORT || 5000 , ()=> {
        console.log("The DataBase Has Connected and the server is running now..", process.env.PORT)
    })
}).catch(()=> {
    console.log("Server Error: Problem in Connecting The DataBase")
})

import { router } from "./src/routes/routes.js"
app.use('/api/v1', router)

export {app}
