const mongoose = require('mongoose')

const ToDoSchema = new mongoose.Schema({
    task:String,
    date:Date
})

module.exports = mongoose.model('todo',ToDoSchema)