const express = require('express');
require('dotenv').config();
const {decodeToken}=require('../middlewares/decodeToken.middleware')
const chatRouter = express.Router();
const {ChatModel}=require('../models/chats.model')

chatRouter.use(decodeToken)

chatRouter.post('/completion',async (req,res)=>{
    const chatInput=req.body.message?.content
    // console.log(chatInput)
    try {
        await fetch("https://api.openai.com/v1/chat/completions",{
            method: 'POST',
            headers:{
                "Content-Type":'application/json',
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body:JSON.stringify({
                model: "gpt-3.5-turbo",
                "messages": [{role: 'user', content: `${chatInput}`}],
                max_tokens: 100
            })
        })
        .then((res)=>res.json())
        .then((data)=>{
            res.status(201).json(data);
        })
    } catch (error) {
        console.log(error)
    }
})

chatRouter.post('/savesession', async(req,res)=>{
    const {userId}=req.userData
    const {previousChats, uniqueTitles}=req.body

    try {
        const chatExists=await ChatModel.findOne({userId})
        if(chatExists){
            await ChatModel.findOneAndUpdate({userId},{titles: uniqueTitles, chats: previousChats})
            res.status(200).json({
                msg: "Session Updated"
            })
        }else{
            const newChat= new ChatModel({userId, titles: uniqueTitles, chats: previousChats})
            newChat.save();
            res.status(200).json({
                msg: "Session Created and Saved"
            })
        }

    } catch (error) {
        console.log(error)
    }

})

chatRouter.post('/prevsession', async(req,res)=>{
    const {userId}=req.userData

    try {
        const chatExists=await ChatModel.findOne({userId})
        if(chatExists){
            res.status(200).json({
                msg: "Previous Sessions",
                previousChats: chatExists.chats, 
                uniqueTitles: chatExists.titles
            })
        }else{
            res.status(200).json({
                msg: "Save A session first"
            })
        }

    } catch (error) {
        console.log(error)
    }

})

module.exports={chatRouter}