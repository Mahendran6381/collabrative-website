const mongoose =  require('mongoose')

const chatSchema = mongoose.Schema({
   username:String,
   messege:String,
})

module.exports = mongoose.model("Chat",chatSchema)
