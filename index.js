import PocketBase from './pocketbase.es.mjs'

const url = 'https://skill-canal.pockethost.io/'
const client = new PocketBase(url)

// get all the expenses
async function getAllExpenses(){
  const records = await client.collection('expenses').getFullList()
  return records
}

// display all expenses
async function displayExpenses(){
  const expenses = await getAllExpenses()
  // console.log(expenses)

  const wrapper = document.querySelector('.wrapper')
  wrapper.innerHTML = ``

  for(let i = 0; i < expenses.length ; i++ ){
  let curExpense = expenses[i]
  // console.log(curExpense)

  wrapper.innerHTML += `
  <div class="expenseItem" data-aos="fade-up" data-aos-delay="${250*i}">
      <p>${new Date(curExpense.date).toLocaleDateString()}</p>
      <h4>${curExpense.name}</h4>
      <p>${curExpense.amount} USD</p>
      <p id="tag">${curExpense.category}</p>
      <div class="btnGroup">
        <button class="btn" id="editBtn">Edit</button>
        <button class="btn" id="deleteBtn" data-recordid = "${curExpense.id}">Delete</button>
      </div>
    </div>
  `
 }

 const deleteBtns = document.querySelectorAll('#deleteBtn')
 for(let i = 0; i < deleteBtns.length ; i++ ){
  let curDeleteBtn = deleteBtns[i]
  curDeleteBtn.addEventListener('click', async () => {
    const id = curDeleteBtn.dataset.recordid
    await client.collection('expenses').delete(id)
    displayExpenses()
  })
 }

 displayChart(expenses)
}

function addNewExpenses(){
  const form = document.querySelector('#createExpense')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const expenseDate = document.querySelector('#date')
    const expenseName = document.querySelector('#name')
    const expenseAmount = document.querySelector('#amount')
    const expenseCategory = document.querySelector('#category')

    const data = {
      "name": expenseName.value,
      "amount": parseFloat(expenseAmount.value) ,
      "date": expenseDate.value,
      "category": expenseCategory.value
  };
  console.log(data)
  const record = await client.collection('expenses').create(data);
  alert("New data is added")

  expenseName.value = ``
  expenseAmount.value = ``
  expenseDate.value = ``
  expenseCategory = ``


  displayExpenses()
})
}


function displayChart(expenses){
// food, health, entertainment, study, other

  const data = [
    {
      category: "food",
      amount: 0
    },

    {
      category: "health",
      amount: 0
    },

    {
      category: "entertainment",
      amount: 0
    },

    {
      category: "study",
      amount: 0
    },

    {
      category: "other",
      amount: 0
    },
  ]

  for(let i = 0 ; i< expenses.length; i++){
    let currExpense = expenses[i]
    if(currExpense.category == "food"){
      data[0].amount += currExpense.amount
    } else if(currExpense.category == "health"){
      data[1].amount += currExpense.amount
    } else if(currExpense.category == "entertainment"){
      data[2].amount += currExpense.amount
    } else if(currExpense.category == "study"){
      data[3].amount += currExpense.amount
    } else if(currExpense.category == "other"){
      data[4].amount += currExpense.amount
    }
  }
  console.log(data)
  let chartStatus = Chart.getChart("myChart"); // <canvas> id
  if (chartStatus != undefined) {
  chartStatus.destroy();
}
  
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["food", "health", "entertainment", "study", "other"],
      datasets: [{
        label: 'Amount to USD',
        data: data.map((item) => item.amount),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


}

window.addEventListener("DOMContentLoaded", async () => {

//   console.log("everything is ready")
//  console.log(client)
  displayExpenses()
  addNewExpenses()
})