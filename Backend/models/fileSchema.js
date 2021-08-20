const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
    originalname:String,
    filename:String
})

module.exports = mongoose.model('fileSchema',fileSchema )