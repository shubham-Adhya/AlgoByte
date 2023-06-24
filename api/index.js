const express=require('express');
const cors = require('cors');
require('dotenv').config()

const {Connection}=require('./config/db')
const {userRouter}=require('./routes/user.routes')
const {chatRouter}=require('./routes/chat.routes')

const app=express();
app.use(express.json());
app.use(cors())

app.get("/",(req,res)=>{
    res.send("OK")
})

app.use('/user', userRouter);
app.use('/chat', chatRouter);


app.listen(process.env.PORT,async ()=>{
    try {
        console.log(`Server is running on port ${process.env.PORT}`);
        await Connection.then(()=>{
            console.log("Connection established to database");
        }).catch(()=>{
            console.log("Database connection Error");
        })
    } catch (error) {
        console.log(error);
    }
})
