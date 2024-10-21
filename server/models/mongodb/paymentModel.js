const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    cardNumber: {type: String, required: true},
    cardHolder: {type: String, required: true},
    transactionType: {type: String, required: true, enum: ['topup', 'withdraw']},
    amount: {type: Number, required: true},
    balance: {type: Number, required: true},
    time : {type: String, required: true}
});
//paymentSchema.index({ cardNumber: 1, cardHolder: 1, transactionType: 1, amount: 1, balance: 1, time: 1 }, { unique: true });
const paymentModel = mongoose.model('paymentmodels', paymentSchema);

module.exports = paymentModel;