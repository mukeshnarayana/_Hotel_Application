const express = require("express");
const WorkerModel = require("../Models/Workers.js");
const middle = require("../Middlewares/middleware.js");
const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
exports.login = async(req,res)=>{
  const{email,password} = req.body
  if(!email||!password){
    return res.status(400).json({success:false, message:'Name and password are required',statuscode: 400})
  }
  try{
    const worker = await WorkerModel.findOne({email})
    if(!worker){
      return res.status(404).json({success:false, message:"No worker found with this email",statuscode:404})
    }
    const isMatch = await bcyrpt.compare(password, worker.password)
    if(!isMatch){
      return res.status(401).json({success:false, message:"Incorrect password",statuscode:401})
    }
    const payload = {worker:{id:worker.email}}
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'})
    return res.status(200).json({success:true, message:"Logged in successfully",statuscode:200,token})


  }
  catch(error){
    console.error(error)
    return res.status(500).json({success:false, message:`Server Error ${error.message}`,statuscode:500})
  }
}
exports.addworker = async (req, res) => {
  try {
    const {token} = req.headers
    if(!token){
      return res.status(400).json({success:false,message:'token is requires',statuscode:400})
    }
    const { name, age, work, salary, mobile, address, password, email } = req.body;
    // Validation
    if (!name || !age || !work || !salary || !mobile || !address || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
        statuscode: 400,
      });
    }
    const decoded = middle.decodeToken(token)
    if(!decoded){
      return res.status(400).json({success:false, message:'Forbidden',statuscode:400})
    }
    const admin = await WorkerModel.findOne({email:decoded})
    console.log(admin)
    if(!admin){
      return res.status(400).json({success:false, message:'admin not found',statuscode:400})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({success:false, message: 'Invalid email format' ,statuscode:400});
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{6,}$/;
    if(!passwordRegex.test(password)){
        return res.status(400).json({success:false,message:'Password must have one uppercaseletter,letters,one specialcharacter,numbers',statuscode:400});
    }
    const phoneRegex = /^\d{10}$/; 
    if(!phoneRegex.test(mobile)){
        return res.status(400).json({success:false,message:'Invalid phone number format',statuscode:400});
    }
    //Check if worker exists
    const worker = await WorkerModel.findOne({ email });
    if (worker) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        statuscode: 400,
      });
    }
    // Hash password
    const hashedpassword = await middle.hashedpassword(password);
     if(admin.work !== 'admin'){
       return res.status(403).json({success:false, message:"Only admins can add workers",statuscode:403})
     }
    // Save worker
    const newWorker = await WorkerModel({
      name,
      age,
      work,
      salary,
      mobile,
      address,
      email,
      password: hashedpassword,
    });
    await newWorker.save();

    return res.status(201).json({
      success: true,
      message: "Worker Added Successfully",
      statuscode: 201,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
      statuscode: 500,
    });
  }
};
exports.allworkers = async(req,res)=>{
     const {token} = req.headers
     if(!token){
        return res.status(400).json({success:false, message: 'Token is required',statuscode:400});
     }
     try{
        const decoded = middle.decodeToken(token)
        const admin = await WorkerModel.findOne({email:decoded})
        if(admin.work !== "admin"){
            return res.status(403).json({success:false, message:"Only admin can get all users data",statuscode:403})
            
        }
        const allworkers = await WorkerModel.find()
        return res.status(200).json({success:true,message:"All workers data is available",statuscode:200,allworkers})
     }
     catch(err){
        console.error("Error:",err)
        return res.status(500).json({success:false,message:`Server Error: ${err.message}`,statuscode:500})
     }
}
exports.oneworker = async(req,res)=>{
    const{token} = req.headers
    const worktype = req.params.worktype
     if(!token ||!worktype){
        return res.status(400).json({success:false, message: 'Token and worktype are required',statuscode:400});
     }
     try{
        const decoded = middle.decodeToken(token)
        const admin = await WorkerModel.findOne({email:decoded})
        if(!worker){
            return res.status(404).json({success:false, message:"No worker found with this email",statuscode:404})
        }
        if(admin.work !== "admin"){
            return res.status(403).json({success:false, message:"Only admin can get specific user data",statuscode:403})
        }
        const perticularworker = await WorkerModel.find({work: worktype})
        if(!perticularworker){
            return res.status(404).json({success:false, message:"No worker found with this worktype",statuscode:404})
        }
        return res.status(200).json({success:true,message:"Specific worker data is available",statuscode:200,worker: perticularworker})
     }
     catch(err){
        console.error("Error:",err)
        return res.status(500).json({success:false,message:`Server Error: ${err.message}`,statuscode:500})
     }
}
exports.updateworker = async(req,res)=>{
    const {token} = req.headers
    const workerid = req.params.workerid
    if(!token || !workerid){
        return res.status(400).json({success:false, message: 'Token and workerid are required',statuscode:400});
    }
    try{
        const decoded = await middle.decodeToken(token)
        const admin = await WorkerModel.findOne({email:decoded})
        if(!admin){
            return res.status(404).json({success:false, message:"No worker found with this email",statuscode:404});
        }
        if(admin.work !== "admin"){
            return res.status(403).json({success:false, message:"Only admin can update worker data",statuscode:403});
        }
        const updateworker = req.body 
        const updatedworker = await WorkerModel.findByIdAndUpdate(workerid,updateworker,{new:true}).select('-password')
        return res.status(200).json({success:true,message:"Worker data updated successfully",statuscode:200,updatedworker})
    }
    catch(err){
        console.error("Error:",err)
        return res.status(500).json({success:false,message:`Server Error: ${err.message}`,statuscode:500})
    }
}
exports.deleteworker = async(req,res)=>{
    const {token} = req.headers
    const workerid = req.params.workerid 
    if(!token || !workerid){
        return res.status(400).json({success:false, message: 'token and workerid are required',statuscode:400});
    }
    try{
      const decoded = await middle.decodeToken(token)
        const admin = await WorkerModel.findOne({email:decoded})
        if(!admin){
            return res.status(404).json({success:false, message:"No worker found with this email",statuscode:404})
        }
        if(admin.work !== 'admin'){
            return res.status(400).json({success:false, message: 'only admin can delete the worker',statuscode:400})
        }
        await WorkerModel.findByIdAndDelete(workerid)
        return res.status(200).json({success:true,message:"Worker  deleted successfully",statuscode:200})
    }
    catch(err){
        console.error("Error:",err)
        return res.status(500).json({success:false,message:`Server Error: ${err.message}`,statuscode:500})
    }
}
