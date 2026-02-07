const mongoose = require('mongoose');

const ConnectDB = async () =>{
    
    await mongoose.connect(process.env.MONGODB_URI);
}

module.exports = ConnectDB;

