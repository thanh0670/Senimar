const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    cardNumber: {type: String, required: true , unique: true},
    cardHolder: {type: String, required: true},
    expirationMM: {type: String, required: true},
    expirationYY: {type: String, required: true},
    CVV: ({type: String, required: true}),
    time : {type: String, required: true}
});

const postTransactionModel = mongoose.model('posttransactionmodels', transactionSchema);
module.exports = postTransactionModel;

// module.exports = mongoose.model('postTransactionModel', schema);
