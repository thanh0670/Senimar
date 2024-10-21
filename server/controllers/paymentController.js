const {DES} = require("../classes/DES.js");
const paymentModel = require("../models/mongodb/paymentModel.js");
const {DateTime} = require("luxon");

const payment = async (req, res) => {
    const {cardNumber, cardHolder, transactionType, amount, balance} = req.body;
    console.log('Dữ liệu nhận được:', req.body);
    const des = new DES();
    const time = String(DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss"));

    
    const encryptedPayment = {
        cardNumber: des.runEncrypt(cardNumber, process.env.DES_KEY),
        cardHolder: des.runEncrypt(cardHolder, process.env.DES_KEY),
        transactionType: des.runEncrypt(transactionType, process.env.DES_KEY),
        amount: des.runEncrypt(amount, process.env.DES_KEY),
        balance: des.runEncrypt(balance, process.env.DES_KEY),
        time: time,
    };

    const decryptedPayment = {
        cardNumber: des.runDecrypt(encryptedPayment.cardNumber, process.env.DES_KEY),
        cardHolder: des.runDecrypt(encryptedPayment.cardHolder, process.env.DES_KEY),
        transactionType: des.runDecrypt(encryptedPayment.transactionType, process.env.DES_KEY),
        amount: des.runDecrypt(encryptedPayment.amount, process.env.DES_KEY),
        balance: des.runDecrypt(encryptedPayment.balance, process.env.DES_KEY),
        time: time,
    };

    try{

        const savedPayment = await paymentModel.create(decryptedPayment);


        const existingPayment = await paymentModel.findOne({
            cardNumber: cardNumber,
            cardHolder: cardHolder,
        });
        
        // // Nếu bản ghi tồn tại, thêm giao dịch mới
        // if (existingPayment) {
        //     // Tạo một giao dịch mới dựa trên thông tin đã tồn tại
        //     const newTransaction = {
        //         cardNumber: existingPayment.cardNumber,
        //         cardHolder: existingPayment.cardHolder,
        //         transactionType, // 'topup' hoặc 'withdraw'
        //         amount, // Số tiền giao dịch
        //         balance, // Số dư sau giao dịch
        //         time, // Thời gian giao dịch
        //     };
        
        //     const createdTransaction = await paymentModel.create(newTransaction);
        //     res.send(createdTransaction);
        // } else {
        //     res.status(404).send({ message: "Card number and holder do not exist." });
        // }

        const newTransaction = {cardNumber, cardHolder, transactionType, amount, balance, time};
        if(existingPayment){
            const savedPayment = await paymentModel.create(newTransaction);
            res.send(savedPayment);
        }else{
            res.status(404).send({message: "Card number and holder do not exist."});
            
        }




        // Phản hồi về cho FE sau khi lưu thành công
        const responsePaymentData = {
            status: des.runEncrypt("Success", process.env.DES_KEY), // Mã hóa trạng thái
            id: des.runEncrypt(savedPayment._id.toString(), process.env.DES_KEY), // Mã hóa ID
            cardNumber: des.runEncrypt(decryptedPayment.cardNumber, process.env.DES_KEY), // Mã hóa cardNumber
            cardHolder: des.runEncrypt(decryptedPayment.cardHolder, process.env.DES_KEY), // Mã hóa cardHolder
            transactionType: des.runEncrypt(decryptedPayment.transactionType, process.env.DES_KEY), // Mã hóa transactionType
            amount: des.runEncrypt(decryptedPayment.amount.toString(), process.env.DES_KEY), // Mã hóa amount
            balance: des.runEncrypt(decryptedPayment.balance.toString(), process.env.DES_KEY), // Mã hóa balance
        };

        console.log('Dữ liệu phản hồi:', responsePaymentData); // Thêm dòng này để kiểm tra dữ liệu
        res.send(responsePaymentData);
    } catch (error) {
        console.error('Lỗi khi lưu giao dịch:', error);
        res.status(500).send({
            status: des.runEncrypt("Failure", process.env.DES_KEY),
            message: "Lỗi khi lưu giao dịch vào MongoDB",
        });
    } 
    console.log('Decrypted data: ', decryptedPayment);
  console.log('Encrypted DATA:', encryptedPayment);
 
}


module.exports = { payment };