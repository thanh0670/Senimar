const mongoose = require('mongoose');



const schema = new mongoose.Schema({
    cardNumber: {type: String, required: true},
    cardHolder: {type: String, required: true},
    mode: {type: String, required: true},
    currency: {type: Number, required: true},
    time : {type: String, required: true}
});


module.exports = mongoose.model('postTransactionModel', schema);