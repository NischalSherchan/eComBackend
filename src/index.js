import { dbConnect } from './db/index.js';
import dotenv from 'dotenv'
import express from 'express'
import userRoutes from './routes/user.routes.js'
import product from './routes/product.routes.js'
import cookieParser from 'cookie-parser';
const localHost = '127.0.0.1'
const app = express()
const port = 5000; 

dotenv.config()
dbConnect().then(()=>{
    app.listen(port,()=>{
        console.log(`example app listening on port http://${localHost}:${port}`)
    })
}).catch((err)=>{
    console.log(`error while connecting, ${err}`);
    
})

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/product',product)


app.get('/',(req,res)=>{
    res.send('' )
})

