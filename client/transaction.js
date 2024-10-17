document.addEventListener('DOMContentLoaded', function () {
    let balance = 1000; // Số dư ban đầu
    let enteredAmount = '';
    let transactionMode = ''; // 'deposit' hoặc 'withdraw'

    const balanceDisplay = document.getElementById('balanceAmount');
    const enteredAmountDisplay = document.getElementById('enteredAmount');
    const transactionMessage = document.getElementById('transactionMessage');

    // Chọn mode nạp tiền hoặc rút tiền
    document.getElementById('topupMode').addEventListener('click', function () {
        transactionMode = 'topup';
        transactionMessage.textContent = 'Mode: topup';
    });

    document.getElementById('withdrawMode').addEventListener('click', function () {
        transactionMode = 'withdraw';
        transactionMessage.textContent = 'Mode: Withdraw';
    });

    // Xử lý khi người dùng nhấn nút số
    document.querySelectorAll('.keypad-btn').forEach(button => {
        button.addEventListener('click', function () {
            enteredAmount += button.textContent;
            enteredAmountDisplay.textContent = enteredAmount;
        });
    });

    // Xử lý khi người dùng nhấn nút Clear
    document.getElementById('clearBtn').addEventListener('click', function () {
        enteredAmount = '';
        enteredAmountDisplay.textContent = '0';
    });

    // Xử lý khi người dùng nhấn nút Enter
    document.getElementById('enterBtn').addEventListener('click', function () {
        const amount = parseInt(enteredAmount);
        if (isNaN(amount) || amount <= 0) {
            transactionMessage.textContent = 'Invalid amount entered.';
            return;
        }

        if (transactionMode === 'topup') {
            balance += amount;
            transactionMessage.textContent = `toped up $${amount.toLocaleString('en-US')}`;
        } else if (transactionMode === 'withdraw') {
            if (amount > balance) {
                transactionMessage.textContent = 'Insufficient balance.';
            } else {
                balance -= amount;
                transactionMessage.textContent = `Withdrew $${amount.toLocaleString('en-US')}`;
            }
        } else {
            transactionMessage.textContent = 'Please select a transaction mode.';
        }

        // Cập nhật số dư và reset số tiền nhập
        balanceDisplay.textContent = balance.toLocaleString('en-US');
        enteredAmount = '';
        enteredAmountDisplay.textContent = '0';
    });
});
