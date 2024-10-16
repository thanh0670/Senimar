import { DES } from '../client/classes/DES.js'; // Import class DES từ file des.js

// Lắng nghe sự kiện submit của form
document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn không cho form reload lại trang

    // Lấy giá trị từ các trường input
    const cardNumber = document.getElementById('cardNumber').value;
    const cardHolder = document.getElementById('cardHolder').value;
    const expirationMM = document.getElementById('expirationMM').value;
    const expirationYY = document.getElementById('expirationYY').value;
    const CVV = document.getElementById('CVV').value;

    // Kiểm tra xem dữ liệu đã nhập chưa
    if (!cardNumber || !cardHolder || !expirationMM || !expirationYY || !CVV) {
        document.getElementById('error-message').innerText = 'Please fill in all fields.';
        return;
    }

    // Tạo một instance của lớp DES
    const des = new DES();

    try {
        // Gửi yêu cầu tới server để kiểm tra thông tin
        const response = await fetch('http://localhost:8000/postTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardNumber, cardHolder, expirationMM, expirationYY, CVV }),
        });

        // Nếu phản hồi không thành công, ném ra lỗi
        if (!response.ok) {
            throw new Error(`Thông tin nhập vào sai rồi`);
        }

        // Nhận kết quả từ server
        const result = await response.json();

        // Kiểm tra xem thông tin có hợp lệ không
        if (!result.isValid) {
            document.getElementById('response').innerText = 'Lỗi: Thông tin không hợp lệ';
            return;
        }         
        // Nếu thông tin hợp lệ, chuyển hướng đến trang transaction.html
        window.location.href = 'transaction.html';

        // In dữ liệu trước khi mã hóa
        console.log('Dữ liệu trước khi mã hóa:', cardNumber, cardHolder, expirationMM, expirationYY, CVV);

        // Mã hóa dữ liệu
        const encryptedCardNumber = des.runEncrypt(cardNumber, '301004FU');
        const encryptedCardHolder = des.runEncrypt(cardHolder, '301004FU');
        const encryptedExpirationMM = des.runEncrypt(expirationMM, '301004FU');
        const encryptedExpirationYY = des.runEncrypt(expirationYY, '301004FU');
        const encryptedCVV = des.runEncrypt(CVV, '301004FU');

        // In dữ liệu đã mã hóa
        console.log('Dữ liệu đã mã hóa:', encryptedCardNumber, encryptedCardHolder, encryptedExpirationMM, encryptedExpirationYY, encryptedCVV);
    } catch (error) {
        // Xử lý lỗi
        console.error("Lỗi khi gọi API:", error.message);
        document.getElementById('response').innerText = 'thông tin nhập vào sai';
    }
});
