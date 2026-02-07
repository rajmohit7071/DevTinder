const mongoose = require('mongoose');

const ConnectDB = async () =>{
    await mongoose.connect("mongodb+srv://rajmohit7114_db_user:ylsBi5LyZ2aon5Df@cluster1.rkxiv8v.mongodb.net/devtinder");

}

module.exports = ConnectDB;

