// // document.addEventListener('DOMContentLoaded', function () {
// //     let balance = 1000; // Số dư ban đầu
// //     let enteredAmount = '';
// //     let transactionMode = ''; // 'deposit' hoặc 'withdraw'

// //     const balanceDisplay = document.getElementById('balanceAmount');
// //     const enteredAmountDisplay = document.getElementById('enteredAmount');
// //     const transactionMessage = document.getElementById('transactionMessage');

// //     // Chọn mode nạp tiền hoặc rút tiền
// //     document.getElementById('topupMode').addEventListener('click', function () {
// //         transactionMode = 'topup';
// //         transactionMessage.textContent = 'Mode: topup';
// //     });

// //     document.getElementById('withdrawMode').addEventListener('click', function () {
// //         transactionMode = 'withdraw';
// //         transactionMessage.textContent = 'Mode: Withdraw';
// //     });

// //     // Xử lý khi người dùng nhấn nút số
// //     document.querySelectorAll('.keypad-btn').forEach(button => {
// //         button.addEventListener('click', function () {
// //             enteredAmount += button.textContent;
// //             enteredAmountDisplay.textContent = enteredAmount;
// //         });
// //     });

// //     // Xử lý khi người dùng nhấn nút Clear
// //     document.getElementById('clearBtn').addEventListener('click', function () {
// //         enteredAmount = '';
// //         enteredAmountDisplay.textContent = '0';
// //     });

// //     // Xử lý khi người dùng nhấn nút Enter
// //     document.getElementById('enterBtn').addEventListener('click', function () {
// //         const amount = parseInt(enteredAmount);
// //         if (isNaN(amount) || amount <= 0) {
// //             transactionMessage.textContent = 'Invalid amount entered.';
// //             return;
// //         }

// //         if (transactionMode === 'topup') {
// //             balance += amount;
// //             transactionMessage.textContent = `toped up $${amount.toLocaleString('en-US')}`;
// //         } else if (transactionMode === 'withdraw') {
// //             if (amount > balance) {
// //                 transactionMessage.textContent = 'Insufficient balance.';
// //             } else {
// //                 balance -= amount;
// //                 transactionMessage.textContent = `Withdrew $${amount.toLocaleString('en-US')}`;
// //             }
// //         } else {
// //             transactionMessage.textContent = 'Please select a transaction mode.';
// //         }

// //         // Cập nhật số dư và reset số tiền nhập
// //         balanceDisplay.textContent = balance.toLocaleString('en-US');
// //         enteredAmount = '';
// //         enteredAmountDisplay.textContent = '0';
// //     });
// // });



// document.addEventListener('DOMContentLoaded', function () {
//     let balance = 1000; // Số dư ban đầu
//     let enteredAmount = '';
//     let transactionMode = ''; // 'topup' hoặc 'withdraw'

//     const balanceDisplay = document.getElementById('balanceAmount');
//     const enteredAmountDisplay = document.getElementById('enteredAmount');
//     const transactionMessage = document.getElementById('transactionMessage');

//     // Chọn mode nạp tiền hoặc rút tiền
//     document.getElementById('topupMode').addEventListener('click', function () {
//         transactionMode = 'topup';
//         transactionMessage.textContent = 'Mode: topup';
//     });

//     document.getElementById('withdrawMode').addEventListener('click', function () {
//         transactionMode = 'withdraw';
//         transactionMessage.textContent = 'Mode: withdraw';
//     });

//     // Xử lý khi người dùng nhấn nút số
//     document.querySelectorAll('.keypad-btn').forEach(button => {
//         button.addEventListener('click', function () {
//             enteredAmount += button.textContent;
//             enteredAmountDisplay.textContent = enteredAmount;
//         });
//     });

//     // Xử lý khi người dùng nhấn nút Clear
//     document.getElementById('clearBtn').addEventListener('click', function () {
//         enteredAmount = '';
//         enteredAmountDisplay.textContent = '0';
//     });

//     // Xử lý khi người dùng nhấn nút Enter
//     document.getElementById('enterBtn').addEventListener('click', async function () {
//         const amount = parseInt(enteredAmount);
//         if (isNaN(amount) || amount <= 0) {
//             transactionMessage.textContent = 'Invalid amount entered.';
//             return;
//         }

//         // Tạo đối tượng giao dịch
//         const transactionData = {
//             cardNumber: '123456', // Thay thế với giá trị thực tế
//             cardHolder: 'Kimphu', // Thay thế với giá trị thực tế
//             transactionType: transactionMode,
//             amount: enteredAmount,
//             balance: balanceAmount.textContent,
//             time: new Date().toISOString(),
//         };

//         try {
//             // Gửi dữ liệu giao dịch đến server
//             const response = await fetch('http://localhost:8000/payment', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(transactionData),
//             });

//             // Kiểm tra phản hồi từ server
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const responseData = await response.json();

//             // Xử lý phản hồi từ server
//             if (responseData.status === 'Success') {
//                 if (transactionMode === 'topup') {
//                     balance += amount;
//                     transactionMessage.textContent = `Toped up $${amount.toLocaleString('en-US')}`;
//                 } else if (transactionMode === 'withdraw') {
//                     if (amount > balance) {
//                         transactionMessage.textContent = 'Insufficient balance.';
//                     } else {
//                         balance -= amount;
//                         transactionMessage.textContent = `Withdrew $${amount.toLocaleString('en-US')}`;
//                     }
//                 }

//                 // Cập nhật số dư
//                 balanceDisplay.textContent = balance.toLocaleString('en-US');
//             } else {
//                 transactionMessage.textContent = 'Transaction failed: ' + responseData.message;
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             transactionMessage.textContent = 'Transaction failed: ' + error.message;
//         }

//         // Reset số tiền nhập
//         enteredAmount = '';
//         enteredAmountDisplay.textContent = '0';
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    let balance = 1000; // Số dư ban đầu
    let enteredAmount = '';
    let transactionMode = ''; // 'topup' hoặc 'withdraw'
    let isProcessing = false; // Biến để theo dõi trạng thái gửi giao dịch

    const balanceDisplay = document.getElementById('balanceAmount');
    const enteredAmountDisplay = document.getElementById('enteredAmount');
    const transactionMessage = document.getElementById('transactionMessage');

    document.getElementById('topupMode').addEventListener('click', function () {
        transactionMode = 'topup';
        transactionMessage.textContent = 'Mode: topup';
    });

    document.getElementById('withdrawMode').addEventListener('click', function () {
        transactionMode = 'withdraw';
        transactionMessage.textContent = 'Mode: withdraw';
    });

    document.querySelectorAll('.keypad-btn').forEach(button => {
        button.addEventListener('click', function () {
            enteredAmount += button.textContent;
            enteredAmountDisplay.textContent = enteredAmount;
        });
    });

    document.getElementById('clearBtn').addEventListener('click', function () {
        enteredAmount = '';
        enteredAmountDisplay.textContent = '0';
    });

    document.getElementById('enterBtn').addEventListener('click', async function () {
        if (isProcessing) return; // Ngăn chặn nhiều lần gửi
        isProcessing = true; // Đặt trạng thái đang xử lý

        const amount = parseInt(enteredAmount);
        if (isNaN(amount) || amount <= 0) {
            transactionMessage.textContent = 'Invalid amount entered.';
            isProcessing = false; // Đặt lại trạng thái
            return;
        }

        const transactionData = {
            cardNumber: '123456',
            cardHolder: 'Kimphu',
            transactionType: transactionMode,
            amount: enteredAmount,
            balance: balanceDisplay.textContent,
            time: new Date().toISOString(),
        };

        try {
            const response = await fetch('http://localhost:8000/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();

            if (responseData.status === 'Success') {
                if (transactionMode === 'topup') {
                    balance += amount;
                    transactionMessage.textContent = `Toped up $${amount.toLocaleString('en-US')}`;
                } else if (transactionMode === 'withdraw') {
                    if (amount > balance) {
                        transactionMessage.textContent = 'Insufficient balance.';
                    } else {
                        balance -= amount;
                        transactionMessage.textContent = `Withdrew $${amount.toLocaleString('en-US')}`;
                    }
                }
                balanceDisplay.textContent = balance.toLocaleString('en-US');
            } else {
                transactionMessage.textContent = 'Transaction failed: ' + responseData.message;
            }
        } catch (error) {
            console.error('Error:', error);
            transactionMessage.textContent = 'Transaction failed: ' + error.message;
        } finally {
            isProcessing = false; // Đặt lại trạng thái sau khi xử lý xong
            enteredAmount = '';
            enteredAmountDisplay.textContent = '0';
        }
    });
});
