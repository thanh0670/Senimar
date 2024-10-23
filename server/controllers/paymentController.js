const { DES } = require("../classes/DES.js");
const paymentModel = require("../models/mongodb/paymentModel.js");
const { DateTime } = require("luxon");

const payment = async (req, res) => {
    const { cardNumber, cardHolder, transactionType, amount, balance } = req.body;
    console.log('Dữ liệu nhận được:', req.body);
    const des = new DES();
    const time = String(DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss"));

    // Mã hóa dữ liệu giao dịch
    const encryptedPayment = {
        cardNumber: des.runEncrypt(cardNumber, process.env.DES_KEY),
        cardHolder: des.runEncrypt(cardHolder, process.env.DES_KEY),
        transactionType: des.runEncrypt(transactionType, process.env.DES_KEY),
        amount: des.runEncrypt(amount, process.env.DES_KEY),
        balance: des.runEncrypt(balance, process.env.DES_KEY),
        time: time,
    };

    try {
        // Giải mã thông tin để kiểm tra
        const decryptedPayment = {
            cardNumber: des.runDecrypt(encryptedPayment.cardNumber, process.env.DES_KEY),
            cardHolder: des.runDecrypt(encryptedPayment.cardHolder, process.env.DES_KEY),
            transactionType: des.runDecrypt(encryptedPayment.transactionType, process.env.DES_KEY),
            amount: des.runDecrypt(encryptedPayment.amount, process.env.DES_KEY),
            balance: des.runDecrypt(encryptedPayment.balance, process.env.DES_KEY),
            time: time,
        };

        // Kiểm tra xem payment với cardNumber và cardHolder có tồn tại không
        const existingPayment = await paymentModel.findOne({
            cardNumber: decryptedPayment.cardNumber,
            cardHolder: decryptedPayment.cardHolder,
        });

        if (existingPayment) {
            // Nếu tồn tại, có thể trả về lỗi hoặc cập nhật giao dịch
            return res.status(400).send({
                message: "Payment with this card number and holder already exists.",
            });
        }

        // Nếu không tồn tại, lưu thông tin giao dịch mới
        const savedPayment = await paymentModel.create(decryptedPayment);

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
};

module.exports = { payment };
