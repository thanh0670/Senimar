const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectMongoDB } = require("./databases/mongoDb/connectMongoDB");
require("dotenv").config(); // Đảm bảo gọi dotenv để load biến môi trường

// Kết nối MongoDB
connectMongoDB(); 

// Model giao dịch
const Card = require("./models/mongodb/postTransactionModel");
const postTransactionModel = require("./models/mongodb/postTransactionModel");


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Xử lý yêu cầu POST /postTransaction
// app.post('/postTransaction', async (req, res) => {
//     const { cardNumber, cardHolder, expirationMM, expirationYY, CVV} = req.body;
//     console.log('Received:', cardNumber, cardHolder, expirationMM, expirationYY, CVV);

//     // try {
//     //     // Kiểm tra dữ liệu
//     //     if (!cardNumber || !cardHolder || !expirationMM || !expirationYY || !CVV) {
//     //         return res.status(400).json({ isValid: false, message: 'Missing required fields' });
//     //     }

//     //     // Tạo giao dịch mới
//     //     const newTransaction = new Card({
//     //         cardNumber,
//     //         cardHolder,
//     //         expirationMM,
//     //         expirationYY,
//     //         CVV,
//     //         time: new Date().toISOString() // Lưu thời gian hiện tại
//     //     });

//     //     // Lưu giao dịch vào MongoDB
//     //     await newTransaction.save();

//     //     // Phản hồi lại client
//     //     res.json({ isValid: true, message: 'Transaction saved successfully' });
//     // } catch (error) {
//     //     console.error-message('Error saving transaction:', error);
//     //     return res.status(500).json({ isValid: false, message: 'Error saving transaction' });
//     // }
//     try{
//         const card = await Card.findOne({
//             cardNumber: cardNumber,
//             cardHolder: cardHolder,
//             expirationMM: expirationMM,
//             expirationYY: expirationYY,
//             CVV: CVV // Thêm kiểm tra trường CVV
//         });

//         if (card) {
//             // Nếu hợp lệ, tiến hành lưu hoặc thực hiện hành động cần thiết
//             return res.json({ isValid: true, message: 'Giao dịch hợp lệ, đã lưu vào DB' });
//         } else {
//             // Nếu không hợp lệ, trả về phản hồi lỗi
//             return res.json({ isValid: false, message: 'Thông tin không hợp lệ, không lưu vào DB' });
//         }
//     } catch (error) {
//         console.error("Lỗi khi truy vấn cơ sở dữ liệu:", error);
//         return res.status(500).json({ isValid: false, message: 'Lỗi server' });
//     }
// });

app.post('/postTransaction', async (req, res) => {
    const { cardNumber, cardHolder, expirationMM, expirationYY, CVV } = req.body;
  
    console.log("Received data: ", cardNumber, cardHolder, expirationMM, expirationYY, CVV);
  
    // Kiểm tra các điều kiện của dữ liệu
    if (!cardNumber || !cardHolder || !expirationMM || !expirationYY || !CVV) {
      console.log("Dữ liệu không hợp lệ: Thiếu thông tin");
      return res.status(400).json({ isValid: false, message: "Thông tin không hợp lệ, không lưu vào DB" });
    }
  
    try {
        // Tìm thông tin thẻ trong DB dựa trên cardNumber, cardHolder và các thông tin khác
        const existingCard = await postTransactionModel.findOne({
            cardNumber, 
            cardHolder, 
            expirationMM, 
            expirationYY, 
            CVV
        });

        // Nếu tìm thấy thông tin hợp lệ trong DB
        if (existingCard) {``
            return res.json({ isValid: true, message: "Thông tin hợp lệ" });
        } else {
            // Nếu không tìm thấy thông tin hợp lệ
            return res.status(400).json({ isValid: false, message: "Thông tin không hợp lệ" });
        }
    } catch (error) {
        console.error('Lỗi khi truy vấn DB:', error);
        return res.status(500).json({ isValid: false, message: 'Internal Server Error' });
    }

    
});
//Xu ly yeu cau GET /getTransaction
app.use('/getTransaction', async (req, res) => {
    const transactions = await postTransactionModel.find();
    res.send(transactions);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
