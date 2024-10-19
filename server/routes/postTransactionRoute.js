const express = require('express');
const { postTransaction, getTransaction } = require('../controllers/postTransactionController');
const router = express.Router();

// Định nghĩa route cho đăng nhập
router.post('/login', (req, res) => {
  const { cardNumber, cardHolder } = req.body;

  // Kiểm tra dữ liệu nhận vào
  if (!cardNumber || !cardHolder) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
  }

  // Xử lý đăng nhập (trả về phản hồi mẫu)
  res.status(200).json({
    isValid: true,
    data: { cardNumber, cardHolder },
  });
});






module.exports = router;
