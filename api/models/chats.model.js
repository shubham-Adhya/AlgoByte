const mongoose=require("mongoose")
const {Schema} = mongoose

const chatSchema = new Schema({
    chats: [],
    titles: [],
    userId: mongoose.Schema.ObjectId
  },
  {versionKey:false, timestamps: true}
);

  const ChatModel= mongoose.model("chat",chatSchema)

  module.exports={ChatModel}