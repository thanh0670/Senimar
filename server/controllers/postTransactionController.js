const { DES } = require("../classes/DES");

const postTransaction = async (req, res) => {
  const { cardNumber, cardHolder, mode, currency } = req.body;
  const des = new DES();
  const decyptedTransaction = {
    cardNumber: des.runDecrypt(cardNumber, process.env.DES_KEY),
    cardHolder: des.runDecrypt(cardHolder, process.env.DES_KEY),
    mode: des.runDecrypt(mode, process.env.DES_KEY),
    currency: des.runDecrypt(currency, process.env.DES_KEY),
  };
  console.log(decyptedTransaction);

  res.send(req.body);
};

module.exports = { postTransaction };
