const MenuModel = require('../Models/Menu')
const WorkerModel = require('../Models/Workers')
const middle = require('../Middlewares/middleware')
exports.additem = async(req,res)=>{
    const {token} = req.headers
    if(!token){
        return res.status(400).json({success:false,message:'email is required',statuscode: 400})
    }
    const{name,price,taste,is_drink,ingredients,num_sales} = req.body
    if(!name ||!price ||!taste ||!ingredients ||!num_sales){
        return res.status(400).json({success:false, message:"All fields are required",statuscode:400})
    }
    try{
        const decoded = await middle.decodeToken(token)
        const worker = await WorkerModel.findOne({email:decoded})
        if(!worker){
            return res.status(404).json({success:false, message:"No worker found with this email",statuscode:404})
        }
        if(worker.work !== "mainchef"){
            return res.status(403).json({success:false, message:"Only mainchefs can add menu items",statuscode:403})
        }
        const menuitem = await MenuModel.create({name,price,taste,is_drink,ingredients,num_sales}) 
        return res.status(200).json({success:true, message:"Menu item added successfully",statuscode:200,menuitem})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success:false,message:`Server Error ${err.message}`,statuscode: 500})
    }
}
exports.allitems = async(req,res)=>{
    try{
        const menuitems = await MenuModel.find()
        return res.status(200).json({success:true, message:"All menu items are available",statuscode:200,menuitems})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success:false,message:`Server Error: ${err.message}`,statuscode:500})
    }
}
exports.itembytaste = async(req,res)=>{
    const taste = req.params.taste
    if(!taste){
        return res.status(400).json({success:false, message:"Taste is required",statuscode:400})
    }
    try{
        const menuitems = await MenuModel.find({taste})
        return res.status(200).json({success:true, message:`Menu items with taste ${taste} are available`,statuscode:200,menuitems})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success:false, message:`Server Error: ${err.message}`,statuscode:500})
    }
}
exports.updateitem = async(req,res)=>{
    const itemid = req.params.itemid 
    const token = req.headers.token
    if(!itemid ||!token){
        return res.status(400).json({success:false, message:"Item ID and email are required",statuscode:400})
    }
    try{
        const decoded = await middle.decodeToken(token)
        const worker = await WorkerModel.findOne({email:decoded})
        if(!worker){
            return res.status(404).json({success:false, message:"No worker found with this email",statuscode:404})
        }
        if(worker.work !== 'mainchef'){
            return res.status(403).json({success:false, message:"Only mainchefs can update menu items",statuscode:403})
        }
        const updateitem = req.body
        const updateditem = await MenuModel.findByIdAndUpdate(itemid,updateitem,{new:true})
        return res.status(200).json({success:true, message:"Menu item updated successfully",statuscode:200,updateditem})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success:false, message:`Server Error: ${err.message}`,statuscode:500})
    }
}
exports.deleteitem = async(req,res)=>{
    const itemid = req.params.itemid
    const token = req.headers.token
    if(!itemid ||!token){
        return res.status(400).json({success:false, message:"Item ID and email are required",statuscode:400})
    }
    try{
        const decoded = await middle.decodeToken(token)
        const worker = await WorkerModel.findOne({email:decoded})
        if(!worker){
            return res.status(404).json({success:false, message:"No worker found with this email",statuscode:404})
        }
        if(worker.work!== 'mainchef'){
            return res.status(403).json({success:false, message:"Only mainchefs can delete menu items",statuscode:403})
        }
        await MenuModel.findByIdAndDelete(itemid)
        return res.status(200).json({success:true, message:"Menu item deleted successfully",statuscode:200})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success:false, message:`Server Error: ${err.message}`,statuscode:500})
    }
}