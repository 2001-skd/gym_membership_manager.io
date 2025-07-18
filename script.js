const addMemberBtn = document.querySelector(".add-member-btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const memberForm = document.querySelector("#member-form");
let tableBody = document.querySelector("tbody");
let filterBox = document.querySelector("#filterbox");
let searchBox = document.querySelector("#searchbox");
let table = document.querySelector("table");
// let pagination = document.querySelector(".pagination");
let membersDetails = [];

function showModalForm() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  document.querySelector("body").style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  document.querySelector("body").style.overflow = "auto";
}

addMemberBtn.addEventListener("click", showModalForm);

document.addEventListener("keydown", (e) => {
  // console.log(e);
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  } else {
    return;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".overlay") && !e.target.closest(".modal")) {
    // console.log("overlay");
    closeModal();
  }
  //   console.log(e.target.closest(".overlay"))
});

// form submission starts
memberForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // input values
  let memberName = document.querySelector("#name").value.trim();
  let memberPhoneNum = document.querySelector("#phone").value.trim();
  let selectedPackage = document.querySelector("#package").value.trim();
  let fees = document.querySelector("#fees").value.trim();
  let address = document.querySelector("#address").value.trim();

  if (!/^\d{10}$/.test(memberPhoneNum)) {
    alert("Enter Vaild Phone Number (10 Digits)");
    return;
  }

  if (!memberName || !selectedPackage || !fees || !address) {
    alert("Please Fill Fields (* All Field Is Required *) ");
    return;
  }
  const membersDetailsObj = {
    memberName,
    memberPhoneNum: Number(memberPhoneNum),
    selectedPackage,
    fees: Number(fees),
    address,
  };
  handleFormSubmit(membersDetailsObj);

  memberForm.reset();
  closeModal();
});

// handle submit function starts
function handleFormSubmit(obj) {
  let stored = JSON.parse(localStorage.getItem("members"));
  stored.push(obj);
  membersDetails = stored;
  showMembersList(membersDetails);

  // console.log(membersDetails.length);
}
// handle submit function ends
// form submission ends

// show members list on table starts
function showMembersList(membersDetails) {
  try {
    localStorage.setItem("members", JSON.stringify(membersDetails));
  } catch (e) {
    console.log("error while saving data", e);
  }
  tableBody.innerHTML = "";
  membersDetails.forEach((list) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${list.memberName}</td>
            <td>${list.memberPhoneNum}</td>
            <td>${list.selectedPackage}</td>
            <td>₹${list.fees}</td>
            <td>${list.address}</td>
          `;
    tableBody.appendChild(tr);
  });
}

// show members list on table ends

document.addEventListener("DOMContentLoaded", () => {
  const stored = JSON.parse(localStorage.getItem("members")) || [];
  const membersDetails = stored;
  const pagination = document.querySelector(".pagination");
  const tableBody = document.querySelector("tbody");

  const dataPerPage = 10;
  const totalPage = Math.ceil(membersDetails.length / dataPerPage);
  let currentPage = 1;

  function displayDataPerPage(startIndex, endIndex) {
    tableBody.innerHTML = "";
    let currentItems = membersDetails.slice(startIndex, endIndex);
    currentItems.forEach((list) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${list.memberName}</td>
        <td>${list.memberPhoneNum}</td>
        <td>${list.selectedPackage}</td>
        <td>₹${list.fees}</td>
        <td>${list.address}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function createpaginationBtn(totalPage) {
    for (let i = 1; i <= totalPage; i++) {
      let pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        const startIndex = (currentPage - 1) * dataPerPage;
        const endIndex = startIndex + dataPerPage;
        displayDataPerPage(startIndex, endIndex);
      });
      pagination.appendChild(pageButton);
    }
  }

  createpaginationBtn(totalPage);
  displayDataPerPage(0, dataPerPage);
});

// create page button starts

// create page button ends

function handleFilterandSearch(index, filterValue) {
  let td, textVal;
  let tr = document.querySelectorAll("tr");
  let filter = filterValue.toUpperCase();

  tr.forEach((row) => {
    td = row.getElementsByTagName("td")[index];
    if (td) {
      textVal = td.textContent || td.innerText;
      row.style.display = textVal.toUpperCase().includes(filter) ? "" : "none";
    }
  });
}

searchBox.addEventListener("keyup", (e) => {
  handleFilterandSearch(0, e.target.value);
});

filterBox.addEventListener("change", (e) => {
  const value = e.target.value;
  // console.log(targetVal);

  if (value === "All") {
    handleFilterandSearch(2, "");
  } else {
    handleFilterandSearch(2, value);
  }
});

// localStorage.clear("members");
