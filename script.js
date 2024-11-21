// Get the table-part element and the transaction-table
const tablePart = document.querySelector(".table-part");
const transactionTable = document.getElementById("transaction-table");

// Function to check the number of entries and apply scrollbar if needed
function checkTableScroll() {
  const rowCount = transactionTable.rows.length - 1; // Exclude the header row
  const maxRowCount = 10; // Set the desired maximum number of entries

  if (rowCount > maxRowCount) {
    tablePart.classList.add("scrollable");
  } else {
    tablePart.classList.remove("scrollable");
  }
}

// Call the function initially and whenever there is a change in the table
checkTableScroll();

// Add an event listener for changes in the table
const observer = new MutationObserver(checkTableScroll);
observer.observe(transactionTable, {
  childList: true,
  subtree: true,
});

// Initialize an empty array to store the transactions
let transactions = [];

// Variable to store the current transaction being edited
let editedTransaction = null;

// Function to add a new transaction
async function addTransaction() {
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeInput = document.getElementById("type");
  const dateInput = document.getElementById("date");

  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const chosenDate = new Date(dateInput.value);

  // Clear the input fields
  descriptionInput.value = "";
  amountInput.value = "";
  dateInput.value = "";

  // Validate the input
  if (description.trim() === "" || isNaN(amount) || isNaN(chosenDate)) {
    return;
  }

  // Create a new transaction object
  const transaction = {
    date: formatDate(chosenDate),
    description: description,
    amount: amount,
    type: type,
  };

  console.log("Transaction to be sent:", JSON.stringify(transaction)); // Debugging log

  // Add the transaction to the array
  transactions.push(transaction);

  // Update the balance
  updateBalance();

  // Update the transaction table
  updateTransactionTable();

  // Make the API call to save the transaction
  try {
    const response = await fetch(`/*Enter API call URL for data feeding into user's database*/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer /*Write AccessId Token*/`, // Include the token here
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Transaction saved:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to update the balance
function updateBalance() {
  const balanceElement = document.getElementById("balance");
  let balance = 0.0;

  transactions.forEach(transaction => {
    if (transaction.type === "income") {
      balance += transaction.amount;
    } else if (transaction.type === "expense") {
      balance -= transaction.amount;
    }
  });

  const currencySelect = document.getElementById("currency");
  const currencyCode = currencySelect.value;
  const formattedBalance = formatCurrency(balance, currencyCode);

  balanceElement.textContent = formattedBalance;

  if (balance < 0) {
    balanceElement.classList.remove("positive-balance");
    balanceElement.classList.add("negative-balance");
  } else {
    balanceElement.classList.remove("negative-balance");
    balanceElement.classList.add("positive-balance");
  }
}

// Function to format currency based on the selected currency code
function formatCurrency(amount, currencyCode) {
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    INR: "₹",
  };

  const decimalSeparators = {
    USD: ".",
    EUR: ",",
    INR: ".",
  };

  const symbol = currencySymbols[currencyCode] || "";
  const decimalSeparator = decimalSeparators[currencyCode] || ".";

  return symbol + amount.toFixed(2).replace(".", decimalSeparator);
}

// Function to format date as DD/MM/YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to update the transaction table
function updateTransactionTable() {
  const transactionTable = document.getElementById("transaction-table");

  while (transactionTable.rows.length > 1) {
    transactionTable.deleteRow(1);
  }

  transactions.forEach(transaction => {
    const newRow = transactionTable.insertRow();

    const dateCell = newRow.insertCell();
    const date = new Date(transaction.date);
    dateCell.textContent = formatDate(date);

    const descriptionCell = newRow.insertCell();
    descriptionCell.textContent = transaction.description;

    const amountCell = newRow.insertCell();
    const currencySelect = document.getElementById("currency");
    const currencyCode = currencySelect.value;
    const formattedAmount = formatCurrency(transaction.amount, currencyCode);
    amountCell.textContent = formattedAmount;

    const typeCell = newRow.insertCell();
    typeCell.textContent = transaction.type;

  });

  checkTableScroll();
}

// Function to handle export (download CSV)
async function handleDownload() {
  try {
    const response = await fetch(`/*Enter API Call URL to get data from user's database */`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer /*Write AccessId Token*/`, // Include the token here
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();
    const csvContent = generateCSV(data);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link after the click
    URL.revokeObjectURL(url); // Revoke the object URL to free memory
  } catch (error) {
    console.error('Error downloading transactions:', error);
  }
}

// Function to generate CSV from transaction data
function generateCSV(data) {
  const headers = ["Date", "Description", "Amount", "Type"];
  const rows = data.map(transaction => [
    formatDate(new Date(transaction.date)),
    transaction.description,
    transaction.amount,
    transaction.type,
  ]);

  // Create CSV string
  const csvRows = [];
  csvRows.push(headers.join(",")); // Add headers

  // Add each transaction as a row
  for (const row of rows) {
    csvRows.push(row.join(","));
  }

  return csvRows.join("\n"); // Join all rows with newline characters
}

// Event listeners for buttons
document.getElementById("add-transaction-btn").addEventListener("click", addTransaction);
document.getElementById("save-transaction-btn").addEventListener("click", saveTransaction);
document.getElementById("download-btn").addEventListener("click", handleDownload);


