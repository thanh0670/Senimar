const mongoose = require('mongoose');
const postTransactionModel = require('../models/mongodb/postTransactionModel');
const {connectMongoDB} = require('../databases/mongoDb/connectMongoDB');

require('dotenv').config();

const clearAllData = async () => {
    try{
        await connectMongoDB();
        await postTransactionModel.deleteMany({});
        console.log('Cleared all data');
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
    finally{
        await mongoose.disconnect();
    }
};

clearAllData();