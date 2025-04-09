const mongoose = require('mongoose')

const MenuSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    taste:{
        type: String,
        required: true,
        enum:['sweet','spicy','sour']
    },
    is_drink:{
        type: Boolean,
        default: false
    },
    ingredients:{
        type: [String],
        required: true
    },
    num_sales:{
        type: Number,
        default: 0
    }

})
const MenuModel = mongoose.model('menu',MenuSchema)

module.exports = MenuModel