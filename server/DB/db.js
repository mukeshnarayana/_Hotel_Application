const express = require('express')
const mongoose = require('mongoose')
const dotEnv = require('dotenv')

dotEnv.config()


const mongodb = async()=>{
        await mongoose.connect(process.env.mongo_url,{
           // maxpoolsize : parseInt(process.env.pool_size)
        })
        .then(()=>console.log('Connected to mongodb with a connection pool'))
        .catch((err)=>console.log(err))
}
module.exports = mongodb