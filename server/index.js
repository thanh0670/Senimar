const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectMongoDB } = require("./databases/mongoDb/connectMongoDB");
require("dotenv").config(); // Đảm bảo gọi dotenv để load biến môi trường
const { DES } = require("./classes/DES");
// Kết nối MongoDB
connectMongoDB();

// Model giao dịch
const Card = require("./models/mongodb/postTransactionModel");
const postTransactionModel = require("./models/mongodb/postTransactionModel");
const paymentModel = require("./models/mongodb/paymentModel");
const router = require('./routes/paymentRoute.js')

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.post("/postTransaction", async (req, res) => {
  const { cardNumber, cardHolder, expirationMM, expirationYY, CVV } = req.body;

  console.log(
    "Received data: ",
    cardNumber,
    cardHolder,
    expirationMM,
    expirationYY,
    CVV
  );

  // Kiểm tra các điều kiện của dữ liệu
  if (!cardNumber || !cardHolder || !expirationMM || !expirationYY || !CVV) {
    console.log("Dữ liệu không hợp lệ: Thiếu thông tin");
    return res
      .status(400)
      .json({
        isValid: false,
        message: "Thông tin không hợp lệ, không lưu vào DB",
      });
  }

  try {
    const des = new DES(); // Khởi tạo DES

    // Mã hóa dữ liệu để lưu log
    const encryptedCardNumber = des.runEncrypt(cardNumber, process.env.DES_KEY);
    const encryptedCardHolder = des.runEncrypt(cardHolder, process.env.DES_KEY);
    const encryptedExpirationMM = des.runEncrypt(expirationMM, process.env.DES_KEY);
    const encryptedExpirationYY = des.runEncrypt(expirationYY, process.env.DES_KEY
    );
    const encryptedCVV = des.runEncrypt(CVV, process.env.DES_KEY);

    console.log("Encrypted data:", { cardNumber: encryptedCardNumber, cardHolder: encryptedCardHolder, expirationMM: encryptedExpirationMM, expirationYY: encryptedExpirationYY, CVV: encryptedCVV, });


    //giải mã dữ liệu
    const decryptedTransaction = {
      cardNumber: des.runDecrypt(encryptedCardNumber, process.env.DES_KEY),
      cardHolder: des.runDecrypt(encryptedCardHolder, process.env.DES_KEY),
      expirationMM: des.runDecrypt(encryptedExpirationMM, process.env.DES_KEY),
      expirationYY: des.runDecrypt(encryptedExpirationYY, process.env.DES_KEY),
      CVV: des.runDecrypt(encryptedCVV, process.env.DES_KEY),
    };

    console.log("Decrypted data:", decryptedTransaction);

    // Tìm thông tin thẻ trong DB dựa trên cardNumber, cardHolder và các thông tin khác
    const existingCard = await postTransactionModel.findOne({
      cardNumber,
      cardHolder,
      expirationMM,
      expirationYY,
      CVV,
    });

    // Nếu tìm thấy thông tin hợp lệ trong DB
    if (existingCard) {
      ``;
      return res.json({ isValid: true, message: "Thông tin hợp lệ" });
    } else {
      // Nếu không tìm thấy thông tin hợp lệ
      return res
        .status(400)
        .json({ isValid: false, message: "Thông tin không hợp lệ" });
    }
  }
  catch (error) {
    console.error("Lỗi khi truy vấn DB:", error);
    return res
      .status(500)
      .json({ isValid: false, message: "Internal Server Error" });
  }
});

//Xu ly yeu cau GET /getTransaction
app.use("/getTransaction", async (req, res) => {
  const transactions = await postTransactionModel.find();
  res.send(transactions);
});


app.use("/", require("../server/routes/paymentRoute.js"));
app.use("/", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


