import { dbConnect } from './db/index.js';
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()
dbConnect()

const localHost = '127.0.0.1'
const app = express()
const port = 5000; 

app.get('/',(req,res)=>{
    res.send('' )
})

app.listen(port,()=>{
    console.log(`example app listening on port http://${localHost}:${port}`)
})