
/* =========================================================
   SMART MONEY MANAGEMENT
   Complete JavaScript
   ========================================================= */


/* =========================
   1. GET HTML ELEMENTS
   ========================= */

const transactionForm =
    document.getElementById("transactionForm");

const transactionName =
    document.getElementById("transactionName");

const amountInput =
    document.getElementById("amount");

const transactionType =
    document.getElementById("transactionType");

const categoryInput =
    document.getElementById("category");

const transactionDate =
    document.getElementById("transactionDate");

const transactionList =
    document.getElementById("transactionList");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpense =
    document.getElementById("totalExpense");

const balance =
    document.getElementById("balance");

const expenseOverview =
    document.getElementById("expenseOverview");

const resetButton =
    document.getElementById("resetButton");


/* =========================
   2. TRANSACTIONS ARRAY
   ========================= */

let transactions =
    JSON.parse(localStorage.getItem("smartMoneyTransactions")) || [];


/* =========================
   3. SET TODAY'S DATE
   ========================= */

function setTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    transactionDate.value =
        `${year}-${month}-${day}`;
}

setTodayDate();


/* =========================
   4. SAVE TO LOCAL STORAGE
   ========================= */

function saveTransactions() {

    localStorage.setItem(
        "smartMoneyTransactions",
        JSON.stringify(transactions)
    );
}


/* =========================
   5. FORMAT MONEY
   ========================= */

function formatMoney(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


/* =========================
   6. FORMAT DATE
   ========================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


/* =========================
   7. ADD TRANSACTION
   ========================= */

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* Get values */

        const name =
            transactionName.value.trim();

        const amount =
            Number(amountInput.value);

        const type =
            transactionType.value;

        const category =
            categoryInput.value;

        const date =
            transactionDate.value;


        /* =========================
           VALIDATION
           ========================= */

        if (name === "") {

            alert("Please enter a transaction name.");

            transactionName.focus();

            return;
        }


        if (
            amountInput.value === "" ||
            isNaN(amount) ||
            amount <= 0
        ) {

            alert("Please enter a valid amount.");

            amountInput.focus();

            return;
        }


        if (type === "") {

            alert("Please select Income or Expense.");

            transactionType.focus();

            return;
        }


        if (date === "") {

            alert("Please select a date.");

            transactionDate.focus();

            return;
        }


        /* =========================
           CREATE TRANSACTION
           ========================= */

        const newTransaction = {

            id: Date.now(),

            name: name,

            amount: amount,

            type: type,

            category: category,

            date: date

        };


        /* Add transaction */

        transactions.push(newTransaction);


        /* Save */

        saveTransactions();


        /* Update dashboard */

        updateDashboard();


        /* Clear form */

        transactionForm.reset();


        /* Put today's date again */

        setTodayDate();


        /* Focus */

        transactionName.focus();

    }
);


/* =========================
   8. UPDATE DASHBOARD
   ========================= */

function updateDashboard() {

    calculateTotals();

    displayTransactions();

    displayExpenseOverview();

}


/* =========================
   9. CALCULATE TOTALS
   ========================= */

function calculateTotals() {

    let income = 0;

    let expense = 0;


    transactions.forEach(function (transaction) {

        const amount =
            Number(transaction.amount) || 0;


        if (transaction.type === "income") {

            income += amount;

        } else if (transaction.type === "expense") {

            expense += amount;

        }

    });


    const currentBalance =
        income - expense;


    /* Display values */

    totalIncome.textContent =
        formatMoney(income);

    totalExpense.textContent =
        formatMoney(expense);

    balance.textContent =
        formatMoney(currentBalance);


    /* Change balance appearance */

    if (currentBalance < 0) {

        balance.style.color = "#d92d20";

    } else {

        balance.style.color = "#111827";

    }

}


/* =========================
   10. DISPLAY TRANSACTIONS
   ========================= */

function displayTransactions() {

    /* Clear table */

    transactionList.innerHTML = "";


    /* No transactions */

    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <tr class="empty-row">

                <td colspan="6" class="empty-table">

                    <div class="empty-table-content">

                        <div class="empty-table-icon">
                            💳
                        </div>

                        <h3>
                            No transactions yet
                        </h3>

                        <p>
                            Add your first transaction
                            using the form above.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    /* Display newest first */

    const sortedTransactions =
        [...transactions].sort(
            (a, b) => b.id - a.id
        );


    sortedTransactions.forEach(function (transaction) {

        const row =
            document.createElement("tr");


        /* Transaction name */

        const nameCell =
            document.createElement("td");

        nameCell.innerHTML = `

            <span class="transaction-name">
                ${escapeHTML(transaction.name)}
            </span>

        `;


        /* Category */

        const categoryCell =
            document.createElement("td");

        categoryCell.innerHTML = `

            <span class="category-badge">
                ${escapeHTML(transaction.category)}
            </span>

        `;


        /* Type */

        const typeCell =
            document.createElement("td");


        if (transaction.type === "income") {

            typeCell.innerHTML = `

                <span class="type-badge type-income">
                    💵 Income
                </span>

            `;

        } else {

            typeCell.innerHTML = `

                <span class="type-badge type-expense">
                    💸 Expense
                </span>

            `;

        }


        /* Date */

        const dateCell =
            document.createElement("td");

        dateCell.textContent =
            formatDate(transaction.date);


        /* Amount */

        const amountCell =
            document.createElement("td");


        if (transaction.type === "income") {

            amountCell.innerHTML = `

                <span class="amount-income">
                    +${formatMoney(transaction.amount)}
                </span>

            `;

        } else {

            amountCell.innerHTML = `

                <span class="amount-expense">
                    -${formatMoney(transaction.amount)}
                </span>

            `;

        }


        /* Delete */

        const actionCell =
            document.createElement("td");


        const deleteButton =
            document.createElement("button");


        deleteButton.className =
            "delete-button";

        deleteButton.type =
            "button";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            function () {

                deleteTransaction(
                    transaction.id
                );

            }
        );


        actionCell.appendChild(
            deleteButton
        );


        /* Add cells */

        row.appendChild(nameCell);

        row.appendChild(categoryCell);

        row.appendChild(typeCell);

        row.appendChild(dateCell);

        row.appendChild(amountCell);

        row.appendChild(actionCell);


        /* Add row */

        transactionList.appendChild(row);

    });

}


/* =========================
   11. DELETE TRANSACTION
   ========================= */

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            function (item) {
                return item.id === id;
            }
        );


    if (!transaction) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete "${transaction.name}"?`
        );


    if (!confirmDelete) {
        return;
    }


    transactions =
        transactions.filter(
            function (item) {
                return item.id !== id;
            }
        );


    saveTransactions();

    updateDashboard();

}


/* =========================
   12. EXPENSE OVERVIEW
   ========================= */

function displayExpenseOverview() {

    /* Get only expenses */

    const expenses =
        transactions.filter(
            function (transaction) {

                return transaction.type === "expense";

            }
        );


    /* No expenses */

    if (expenses.length === 0) {

        expenseOverview.innerHTML = `

            <div class="empty-overview">

                <div class="empty-icon">
                    📊
                </div>

                <h3>
                    No expenses yet
                </h3>

                <p>
                    Add an expense to see your
                    spending overview.
                </p>

            </div>

        `;

        return;
    }


    /* =========================
       GROUP EXPENSES BY NAME
       ========================= */

    const expenseGroups = {};


    expenses.forEach(function (expense) {

        const name =
            expense.name.trim();


        if (!expenseGroups[name]) {

            expenseGroups[name] = 0;

        }


        expenseGroups[name] +=
            Number(expense.amount) || 0;

    });


    /* Convert object to array */

    const expenseArray =
        Object.entries(expenseGroups);


    /* Sort largest first */

    expenseArray.sort(
        function (a, b) {

            return b[1] - a[1];

        }
    );


    /* Find largest expense */

    const maxExpense =
        expenseArray.length > 0
            ? expenseArray[0][1]
            : 1;


    /* Clear overview */

    expenseOverview.innerHTML = "";


    /* Create bars */

    expenseArray.forEach(
        function ([name, amount]) {


            let percentage =
                (amount / maxExpense) * 100;


            /* Prevent very small bars */

            if (percentage < 5) {

                percentage = 5;

            }


            const item =
                document.createElement("div");

            item.className =
                "expense-item";


            item.innerHTML = `

                <div class="expense-info">

                    <span class="expense-name">
                        ${escapeHTML(name)}
                    </span>

                    <span class="expense-amount">
                        ${formatMoney(amount)}
                    </span>

                </div>


                <div class="expense-bar-background">

                    <div
                        class="expense-bar"
                        style="width: ${percentage}%"
                    ></div>

                </div>

            `;


            expenseOverview.appendChild(item);

        }
    );

}


/* =========================
   13. RESET ALL
   ========================= */

resetButton.addEventListener(
    "click",
    function () {

        if (transactions.length === 0) {

            alert(
                "There are no transactions to reset."
            );

            return;
        }


        const confirmReset =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (!confirmReset) {
            return;
        }


        /* Empty array */

        transactions = [];


        /* Clear localStorage */

        localStorage.removeItem(
            "smartMoneyTransactions"
        );


        /* Update dashboard */

        updateDashboard();


        /* Reset form */

        transactionForm.reset();


        /* Set today's date */

        setTodayDate();

    }
);


/* =========================
   14. ESCAPE HTML
   ========================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}


/* =========================
   15. START APPLICATION
   ========================= */

updateDashboard();

