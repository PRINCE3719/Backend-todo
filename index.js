const express = require("express")
const port = 4000
const app = express()
const router = require("./route");
const dotenv = require("dotenv")
const {dbconnect} = require("./database.js")
const cors = require("cors")

app.use(cors())
app.use(express.json())
dotenv.config()

app.use("/api",router)


app.listen(port,async ()=>{
    await dbconnect()
    console.log(`connected to ${port}`);
})

