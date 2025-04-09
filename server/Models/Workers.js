const express = require('express')
const mongoose = require('mongoose')


const workersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true,
        enum:['chef','mainchef','waiter','cleaner','manager','admin']
    },
    salary:{
        type:Number,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const WorkerModel =  new mongoose.model('workers',workersSchema)
module.exports = WorkerModel