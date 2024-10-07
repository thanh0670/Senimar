const { DES } = require("../classes/DES");
const  postTransactionModel  = require("../models/mongodb/postTransactionModel");
const { DateTime } = require("luxon");


const postTransaction = async (req, res) => {
  const { cardNumber, cardHolder, mode, currency } = req.body;
  const des = new DES();
  const time = String(DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss"));
  const decyptedTransaction = {
    cardNumber: des.runDecrypt(cardNumber, process.env.DES_KEY),
    cardHolder: des.runDecrypt(cardHolder, process.env.DES_KEY),
    mode: des.runDecrypt(mode, process.env.DES_KEY),
    currency: Number(des.runDecrypt(currency, process.env.DES_KEY)),
    time: time,
  };

  const savedTransaction = await postTransactionModel.create(decyptedTransaction); // Save to MongoDB


  console.log(decyptedTransaction);

  res.send(req.body);
};

module.exports = { postTransaction };
