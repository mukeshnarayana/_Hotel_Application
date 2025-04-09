const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.hashedpassword = async (password)=>{
    const saltrounds = 10
    const hashedpassword =  await bcyrpt.hash(password, saltrounds)
    return hashedpassword
}
exports.decodeToken = (token) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.worker.id; 
};
