const express = require('express')
const menurouter = express.Router()
const menu = require('../Controllers/Menu.js')


menurouter.post('/additem', menu.additem)
menurouter.get('/allitems',menu.allitems)
menurouter.get('/itembytaste/:taste',menu.itembytaste)
menurouter.put('/updateitem/:itemid',menu.updateitem)
menurouter.delete('/deleteitem/:itemid',menu.deleteitem)
module.exports = menurouter