const mongoose = require('mongoose')

const fruitSchema = new mongoose.Schema({
    name:{
        type: String,
        default: 'nil'
    },
    seeds:{
        type: Boolean,
        default: false
    }
})

const Fruit = mongoose.model("Fruit", bookSchema);
module.exports = Fruit