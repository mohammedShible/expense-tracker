// display menu icon
let menuIcon = document.querySelector(".menu-icon");
let sideBar = document.querySelector(".side-bar");

menuIcon.onclick = function (event) {
  event.stopPropagation();
  sideBar.classList.toggle("activeMenu");
  // if (sideBar.classList.contains("activeMenu")) {
  //   sideBar.style.display = "flex";
  // } else {
  //   sideBar.style.display = "none";
  // }
};
document.addEventListener("click", (element) => {
  if (
    sideBar.classList.contains("activeMenu") &&
    !sideBar.contains(element.target)
  ) {
    sideBar.classList.remove("activeMenu");
  }
});
// Choose Category
let activeTriggerButton = null;
document.addEventListener("click", (evt) => {
  const triggerBtn = evt.target.closest(".category, .edit-category");
  const dropdown = document.querySelector(".myDropdown");

  if (triggerBtn) {
    evt.stopPropagation();

    activeTriggerButton = triggerBtn;

    const rect = triggerBtn.getBoundingClientRect();
    const topPosition = rect.bottom + window.scrollY + 2;
    const leftPosition = rect.left + window.scrollX + 150;

    dropdown.style.position = "absolute";
    dropdown.style.top = `${topPosition}px`;
    dropdown.style.left = `${leftPosition}px`;

    dropdown.classList.toggle("active");

    if (activeTriggerButton.classList.contains("edit-category")) {
      window.scrollTo({
        top: 350,
        behavior: "smooth",
      });
    }
  } else if (!dropdown.contains(evt.target)) {
    dropdown.classList.remove("active");
    activeTriggerButton = null;
  }
});

const addExpenseBtn = document.querySelector(".add-expense-btn");
document.querySelectorAll(".dropdown-content a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    let optionSelected = e.target.textContent;

    if (activeTriggerButton) {
      if (activeTriggerButton.classList.contains("category")) {
        let spanText1 = document.getElementById("selectedText1");
        if (spanText1) spanText1.textContent = optionSelected;
        addExpenseBtn.focus();
        if (categorySpanOfBtn.textContent !== "Choose Category")
          categoryBtn.classList.remove("error-input");
      } else if (activeTriggerButton.classList.contains("edit-category")) {
        let spanText2 = document.getElementById("selectedText2");
        if (spanText2) spanText2.textContent = optionSelected;
      }
    }

    const dropdown = document.querySelector(".myDropdown");
    if (dropdown) {
      dropdown.classList.remove("active");
    }

    activeTriggerButton = null;
  });
});
window.onclick = function (event) {
  const dropdown = document.querySelector(".myDropdown");
  if (dropdown.classList.contains("active")) {
    dropdown.classList.remove("active");
  }
};

// Update Date in header
let theDateInHeader = document.querySelector(".the-date");
const theDate = dayjs().format("MMM DD,YYYY");
theDateInHeader.textContent = theDate;

// Enable the dark Mode, even when the page is refreshed
let darkModeArray = [];
getDarkModeFromLocalStorage();
document.querySelector(".mode-of-thePage").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  myChart.data.datasets[0].borderColor = isDark ? "#1e293b" : "#ffffff";
  myChart.update();

  addModeToDarkModeArry(isDark);
});
function addModeToDarkModeArry(_isDark) {
  const onDark = {
    enabled: false,
  };
  if (_isDark) {
    onDark.enabled = true;
  }
  darkModeArray[0] = onDark;
  addToLocalStorage("darkMode", darkModeArray);
}
function addToLocalStorage(item, array) {
  localStorage.setItem(item, JSON.stringify(array));
}
function getDarkModeFromLocalStorage() {
  let _darkMode = localStorage.getItem("darkMode");

  if (_darkMode) {
    try {
      _darkMode = JSON.parse(_darkMode);

      if (_darkMode?.[0]) {
        document.body.classList.toggle(
          "dark-mode",
          _darkMode[0].enabled === true,
        );
      }
    } catch (error) {
      console.error("Invalid dark mode data:", error);
    }
  }
}

let form = document.querySelector(".add-expense-form");
let expenseNameInput = document.getElementById("expense-name");
let amountInput = document.getElementById("amount");
let categoryBtn = document.querySelector(".category");
let categorySpanOfBtn = document.querySelector(".Category-span");
let transactionsContainer = document.querySelector(".transactions-container");

let arrayOfTransactions = [];

if (localStorage.getItem("transaction")) {
  arrayOfTransactions = JSON.parse(localStorage.getItem("transaction"));
}

getDataFromLocalStorage();

transactionsContainer.addEventListener("click", (e) => {
  // Delete Button
  if (e.target.classList.contains("del")) {
    // Remove Element From Local Storage
    deleteTransactionWith(
      e.target.closest(".transaction").getAttribute("data-id"),
    );
    // Remove Element From The Page
    const transactionElement = e.target.closest(".transaction");
    if (transactionElement) {
      const nextHr = transactionElement.nextElementSibling;

      if (nextHr && nextHr.tagName === "HR") {
        nextHr.remove();
      }

      transactionElement.remove();
    }
  }
  updateChartData(arrayOfTransactions);
});

// Edit transaction
const popup = document.querySelector(".edit-expense");
const closeBtn = document.getElementById("close-edit-window-btn");
const editExpenseName = document.getElementById("edit-expense-name");
const editAmount = document.getElementById("edit-amount");
const editCategorySpan = document.querySelector(".edit-Category-span");
const editCategoryBtn = document.querySelector(".edit-category");
const editExpenseForm = document.querySelector(".edit-expense-form");
let idOfTransaction = "";

transactionsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-icon")) {
    e.stopPropagation();

    popup.classList.toggle("activeEdit");

    const rect = e.target.getBoundingClientRect();

    const topPosition = rect.bottom + window.scrollY + 5;
    const leftPosition = rect.left + window.scrollX;

    popup.style.top = `${topPosition}px`;
    popup.style.left = `${leftPosition}px`;

    idOfTransaction = e.target.closest(".transaction").dataset.id;
    arrayOfTransactions.forEach((item) => {
      if (idOfTransaction == item.id) {
        editExpenseName.value = item.expenseName;
        editAmount.value = item.amount;
        editCategorySpan.textContent = item.category;
      }
    });

    editExpenseName.focus();
    editExpenseName.select();

    editAmount.addEventListener("focus", () => {
      editAmount.select();
    });
  }
});

closeBtn.addEventListener("click", () => {
  popup.classList.remove("activeEdit");
});
document.addEventListener("click", function (event) {
  if (
    popup.classList.contains("activeEdit") &&
    !popup.contains(event.target) &&
    !event.target.closest(".myDropdown")
  ) {
    popup.classList.remove("activeEdit");
  }
});

editExpenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  arrayOfTransactions.forEach((item) => {
    if (idOfTransaction == item.id) {
      const EditExpenseValue = editExpenseName.value.trim();
      const EditAmountValue = parseFloat(editAmount.value);

      if (
        EditExpenseValue !== "" &&
        !isNaN(EditAmountValue) &&
        EditAmountValue !== 0
      ) {
        item.expenseName = EditExpenseValue;
        item.amount = EditAmountValue;
        item.category = editCategorySpan.textContent;
      }
    }
  });
  popup.classList.remove("activeEdit");
  idOfTransaction = "";
  addToLocalStorage("transaction", arrayOfTransactions);
  getDataFromLocalStorage();
  updateChartData(arrayOfTransactions);
});
// Delete All Transactions
let deleteAllTransactions = document.querySelector(".delete-all-transactions");

deleteAllTransactions.addEventListener("click", () => {
  if (deleteAllTransactions) {
    localStorage.setItem("transaction", "");
    transactionsContainer.textContent = "";
    arrayOfTransactions = [];
  }
  updateChartData(arrayOfTransactions);
});

// Prevent the entry of anything other than numbers(float) and replace it with " "
[amountInput, editAmount].forEach((input) => {
  if (input) {
    input.addEventListener("input", (e) => {
      let value = e.target.value;

      value = value.replace(/[^0-9.]/g, "");

      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }

      if (/^0[0-9]/.test(value)) {
        value = value.replace(/^0+/, "");
      }

      e.target.value = value;
    });
  }
});

// Invalid input
expenseNameInput.addEventListener("input", () => {
  if (expenseNameInput.value.trim() !== "") {
    expenseNameInput.classList.remove("error-input");
  }
});

amountInput.addEventListener("input", () => {
  const amountValue = parseFloat(amountInput.value);

  if (amountInput.value !== "" && !isNaN(amountValue) && amountValue !== 0) {
    amountInput.classList.remove("error-input");
  }
});
categoryBtn.addEventListener("blur", () => {
  if (categorySpanOfBtn.textContent !== "Choose Category") {
    categoryBtn.classList.remove("error-input");
  }
});

// Add The Expenses
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const expenseValue = expenseNameInput.value.trim();
  const amountValue = parseFloat(amountInput.value);
  const categoryText = categorySpanOfBtn.textContent;
  if (
    expenseValue !== "" &&
    !isNaN(amountValue) &&
    amountValue !== 0 &&
    categoryText !== "Choose Category"
  ) {
    expenseNameInput.classList.remove("error-input");
    amountInput.classList.remove("error-input");

    addTransactionToArray(expenseValue, amountValue, categoryText);

    expenseNameInput.value = "";
    amountInput.value = "";
    categorySpanOfBtn.textContent = "Choose Category";
  } else {
    if (expenseValue === "") {
      expenseNameInput.classList.add("error-input");
    } else {
      expenseNameInput.classList.remove("error-input");
    }

    if (amountInput.value === "" || amountValue === 0 || isNaN(amountValue)) {
      amountInput.classList.add("error-input");
    } else {
      amountInput.classList.remove("error-input");
    }

    if (categoryText === "Choose Category") {
      categoryBtn.classList.add("error-input");
    } else {
      categoryBtn.classList.remove("error-input");
    }
  }
  addExpenseBtn.blur();
  updateChartData(arrayOfTransactions);
});

function addTransactionToArray(expenseNameValue, amountValue, CategoryValue) {
  const transaction = {
    id: Date.now(),
    date: dayjs().format("YYYY/M/D"),
    expenseName: expenseNameValue,
    amount: amountValue,
    category: CategoryValue,
  };
  arrayOfTransactions.push(transaction);
  addToLocalStorage("transaction", arrayOfTransactions);
  addElementsToPageFrom(arrayOfTransactions);
}

function addElementsToPageFrom(arrayOfTransactions) {
  transactionsContainer.innerHTML = "";
  let counter = 0;
  arrayOfTransactions.forEach((element) => {
    counter++;
    // create transaction div
    let transaction = document.createElement("div");
    transaction.className = "transaction";
    transaction.setAttribute("data-id", element.id);

    // create actions-icons div
    let actionsIcons = document.createElement("div");
    actionsIcons.className = "actions-icons";

    let trashIcon2 = document.createElement("i");
    trashIcon2.className = "fa-solid fa-trash-can trash-icon2 del";
    let editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pen edit-icon";

    actionsIcons.appendChild(trashIcon2);
    actionsIcons.appendChild(editIcon);
    // create date-of-transaction div
    let dateOfTransaction = document.createElement("div");
    dateOfTransaction.className = "date-of-transaction";

    let dateOfTransactionPara = document.createElement("p");
    dateOfTransactionPara.textContent = element.date;

    dateOfTransaction.appendChild(dateOfTransactionPara);

    // create amount-details div
    let amountDetails = document.createElement("div");
    amountDetails.className = "amount-details";

    let amountOfTransaction = document.createElement("span");
    amountOfTransaction.className = "data-of-transaction";
    amountOfTransaction.textContent = `$ ${element.amount}`;

    amountDetails.appendChild(amountOfTransaction);
    // create category-of-transaction div
    let categoryOfTransaction = document.createElement("div");

    let spanOfCategory = document.createElement("span");
    spanOfCategory.textContent = element.category;
    changeBgCategory(categoryOfTransaction, spanOfCategory.textContent); // className categoryOfTransaction Div

    let iconOfCategory = document.createElement("i");
    changeIconOfCategory(iconOfCategory, spanOfCategory.textContent); // className

    categoryOfTransaction.appendChild(spanOfCategory);
    categoryOfTransaction.appendChild(iconOfCategory);
    // create name-of-transaction div
    let nameOfTransaction = document.createElement("div");
    nameOfTransaction.className = "name-of-transaction";

    let nameOfTransactionPara = document.createElement("p");
    nameOfTransactionPara.className = "name-of-transaction-para";
    nameOfTransactionPara.textContent = element.expenseName;

    let nameOfTransactionIcon = document.createElement("i");
    changeIconOfCategory(nameOfTransactionIcon, spanOfCategory.textContent); // className

    nameOfTransaction.appendChild(nameOfTransactionPara);
    nameOfTransaction.appendChild(nameOfTransactionIcon);
    // create counter
    let counterSpan = document.createElement("span");
    counterSpan.className = "counter-span-of-transaction";
    counterSpan.textContent = counter;
    // create hr
    let hrOfTransaction = document.createElement("hr");
    hrOfTransaction.className = "hr-of-transaction";
    // append all divs in transaction div
    transaction.appendChild(actionsIcons);
    transaction.appendChild(dateOfTransaction);
    transaction.appendChild(amountDetails);
    transaction.appendChild(categoryOfTransaction);
    transaction.appendChild(nameOfTransaction);
    transaction.appendChild(counterSpan);
    // add transaction div to transactions-container
    transactionsContainer.appendChild(transaction);
    transactionsContainer.appendChild(hrOfTransaction);
  });
}
function getDataFromLocalStorage() {
  let data = localStorage.getItem("transaction");
  if (data) {
    let transactions = JSON.parse(data);
    addElementsToPageFrom(transactions);
  }
}
function deleteTransactionWith(transactionId) {
  arrayOfTransactions = arrayOfTransactions.filter(
    (transaction) => transaction.id != transactionId,
  );
  addToLocalStorage("transaction", arrayOfTransactions);
}

function changeIconOfCategory(theIcon, category) {
  if (category === "Rent") {
    theIcon.className = "fa-solid fa-house-chimney";
  }
  if (category === "Food") {
    theIcon.className = "fa-solid fa-utensils";
  }
  if (category === "Transport") {
    theIcon.className = "fa-solid fa-truck-front";
  }
  if (category === "Entertainment") {
    theIcon.className = "fa-solid fa-puzzle-piece";
  }
  if (category === "Other") {
    theIcon.className = "fa-solid fa-tags";
  }
}
function changeBgCategory(categoryDiv, category) {
  if (category === "Rent") {
    categoryDiv.className = "category-of-transaction rent";
  }
  if (category === "Food") {
    categoryDiv.className = "category-of-transaction food";
  }
  if (category === "Transport") {
    categoryDiv.className = "category-of-transaction transport";
  }
  if (category === "Entertainment") {
    categoryDiv.className = "category-of-transaction entertainment";
  }
  if (category === "Other") {
    categoryDiv.className = "category-of-transaction Other";
  }
}

// statistics graph
const isDark = document.body.classList.contains("dark-mode");
let initialBorderColor = isDark ? "#1e293b" : "#ffffff";

const ctx = document.getElementById("myPieChart").getContext("2d");

const myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Rent", "Food", "Transport", "Entertainment", "Other"],
    datasets: [
      {
        data: [400, 240, 150, 100, 110],
        backgroundColor: [
          "#3b82f6", // لون Rent
          "#f97316", // لون Food
          "#10b981", // لون Transport
          "#8b5cf6", // لون Entertainment
          "#6b7280", // لون Other
        ],
        borderWidth: 4,
        borderColor: initialBorderColor,
        hoverBorderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return "$" + value;
          },
        },
      },
    },
    cutout: "60%",
  },
});

function updateChartData(arrayOfTransactions) {
  let statisticsContainer = document.querySelector(".statistics-container");
  let noDataMsg = document.querySelector(".no-data-message");
  let amountRent = 0;
  let amountFood = 0;
  let amountTransport = 0;
  let amountEntertainment = 0;
  let amountOther = 0;
  let dataArray = [];

  if (arrayOfTransactions.length === 0) {
    statisticsContainer.classList.remove("activeData");
    noDataMsg.classList.add("activeNoData");
  } else {
    noDataMsg.classList.remove("activeNoData");
    statisticsContainer.classList.add("activeData");

    arrayOfTransactions.forEach((e) => {
      let amount = Number(e.amount) || 0;
      if (e.category === "Rent") {
        amountRent += amount;
      } else if (e.category === "Food") {
        amountFood += amount;
      } else if (e.category === "Transport") {
        amountTransport += amount;
      } else if (e.category === "Entertainment") {
        amountEntertainment += amount;
      } else if (e.category === "Other") {
        amountOther += amount;
      }
    });
    dataArray = [
      amountRent,
      amountFood,
      amountTransport,
      amountEntertainment,
      amountOther,
    ];
    myChart.data.datasets[0].data = [...dataArray];
  }
  myChart.update();

  const total = dataArray.reduce((sum, item) => sum + item, 0);
  const totalElement = document.getElementById("totalAmount");
  if (totalElement) {
    totalElement.textContent = total + " $";
  }
  statisticsDetails(dataArray, total);
  // update Total Expense value
  document.querySelector(".total-expense-para").textContent = `${total}$`;

  updateCountOfExpense(arrayOfTransactions);
  updateMaxExpense(arrayOfTransactions);
}

updateChartData(arrayOfTransactions);

function statisticsDetails(datasets, total) {
  for (let i = 0; i < datasets.length; i++) {
    if (datasets[i] !== 0 && total > 0) {
      datasets[i] = (datasets[i] / total) * 100;
      datasets[i] = Math.round(datasets[i]);
    }
  }

  let statisticsDetails = [
    "Rent-span",
    "Food-span",
    "Transport-span",
    "Entertainment-span",
    "Other-span",
  ];
  let has100 = false;

  statisticsDetails.forEach((e, i) => {
    let targetElement = document.getElementById(e);
    if (!targetElement) return;
    if (datasets[i] !== 0) {
      targetElement.textContent = datasets[i] + "%";
      targetElement.parentElement.style.display = "";
    } else {
      targetElement.parentElement.style.display = "none";
    }
    if (datasets[i] === 100) {
      has100 = true;
    }
  });
  if (has100) {
    myChart.data.datasets[0].borderWidth = 0;
  } else {
    myChart.data.datasets[0].borderWidth = 4;
  }
  myChart.update();
}

function updateCountOfExpense(arrayOfTransactions) {
  let countOfExpense = arrayOfTransactions.length;
  document.querySelector(".count-of-expense-para").textContent = countOfExpense;
}

function updateMaxExpense(arrayOfTransactions) {
  let maxArray = [];
  let maxExpense = 0;
  arrayOfTransactions.forEach((e) => {
    maxArray.push(+e.amount);
  });

  maxExpense = maxArray.reduce((acc, current) => {
    return acc > current ? acc : current;
  }, 0);
  let maxExpenseParagraph = document.querySelector(".max-Expense-para");
  if (maxExpenseParagraph) {
    maxExpenseParagraph.textContent = `${maxExpense} $`;
  }
}
updateMaxExpense(arrayOfTransactions);
