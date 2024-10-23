document.addEventListener("DOMContentLoaded", () => {
    let currentAmount = "";
    let mode = "";
    let balance = 1000;

    const balanceDisplay = document.getElementById("balanceAmount");
    const enteredAmountDisplay = document.getElementById("enteredAmount");
    const transactionMessage = document.getElementById("transactionMessage");

    const updateBalanceDisplay = () => {
        balanceDisplay.innerText = balance.toFixed(2);
    };

    const updateEnteredAmountDisplay = () => {
        enteredAmountDisplay.innerText = currentAmount || "0";
    };

    document.getElementById("topupMode").addEventListener("click", () => {
        mode = "topup";
        transactionMessage.innerText = "Topup mode selected";
    });

    document.getElementById("withdrawMode").addEventListener("click", () => {
        mode = "withdraw";
        transactionMessage.innerText = "Withdraw mode selected";
    });

    document.querySelectorAll(".keypad-btn").forEach((button) => {
        button.addEventListener("click", () => {
            if (currentAmount.length < 6) {
                currentAmount += button.innerText;
                updateEnteredAmountDisplay();
            }
        });
    });

    document.getElementById("clearBtn").addEventListener("click", () => {
        currentAmount = "";
        updateEnteredAmountDisplay();
    });

    document.getElementById("enterBtn").addEventListener("click", async () => {
        const amount = parseFloat(currentAmount);

        if (!mode) {
            transactionMessage.innerText = "Please select a mode first!";
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            transactionMessage.innerText = "Invalid amount entered!";
            return;
        }

        if (mode === "topup") {
            try {
                const response = await fetch("http://localhost:8000/api/topup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transactionType: mode, amount, balance }),
                });

                const result = await response.json();
                if (result.success) {
                    balance += amount;
                    updateBalanceDisplay();
                    transactionMessage.innerText = "Topup successful!";
                } else {
                    transactionMessage.innerText = "Topup failed.";
                }
            } catch (error) {
                console.error("Error during topup:", error);
                transactionMessage.innerText = "Error during topup.";
            }
        } else if (mode === "withdraw") {
            if (balance < amount) {
                transactionMessage.innerText = "Insufficient balance!";
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/api/withdraw", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transactionType: mode, amount, balance }),
                });

                const result = await response.json();
                if (result.success) {
                    balance -= amount;
                    updateBalanceDisplay();
                    transactionMessage.innerText = "Withdraw successful!";
                } else {
                    transactionMessage.innerText = "Withdraw failed.";
                }
            } catch (error) {
                console.error("Error during withdraw:", error);
                transactionMessage.innerText = "Error during withdraw.";
            }
        }

        currentAmount = "";
        updateEnteredAmountDisplay();
    });
});
