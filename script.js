let addItem = document.getElementById("addItem");
let deadline = document.getElementById("deadline");
let priority = document.getElementById("priority");
let listItem = document.getElementsByClassName("list_item");

// handle submit function logic
function handleSubmit(event) {
  if (
    addItem.value.trim() == "" ||
    deadline.value == "" ||
    priority.value == ""
  ) {
    alert("empty field");
    return;
  }
  let date = deadline.value.split("-");
  let formatedDeadline = `${date[2]}-${date[1]}-${date[0]}`;

  let itemData = {
    id: Date.now(),
    name: addItem.value,
    date: formatedDeadline,
    priority: priority.value,
    completed: false,
  };
  addTodo(itemData);
  //   todoList.push(list);
  //   console.log(todoList);
}

// check the date
function findDate(date) {
  let parts = date.split("-");
  let todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  inputDate = new Date(parts[2], parts[1] - 1, parts[0]);

  console.log(todayDate.getTime());
  console.log(inputDate.getTime());
  if (todayDate.getTime() == inputDate.getTime()) {
    return 1;
  } else if (todayDate.getTime() < inputDate.getTime()) return 2;
  else return 3;
}

let todayTodoList = [];
let futureTodoList = [];
let completedTodoList = [];

// adding todo logic
function addTodo(itemData) {
  if (findDate(itemData.date) == 1) {
    // console.log(todayTodoList);
    // localStorage.setItem()
    todayTodoList.push(itemData);
    localStorage.setItem("todayTodoList", JSON.stringify(todayTodoList));
    render(1, 0);
  } else if (findDate(itemData.date) == 2) {
    futureTodoList.push(itemData);
    localStorage.setItem("futureTodoList", JSON.stringify(futureTodoList));
    render(0, 1);
  } else {
    alert("Past Date is not valid");
  }

  //   console.log(itemData);
}

function render(today, future, completed) {
  if (today) {
    if (localStorage.getItem("todayTodoList")) {
      todayTodoList = JSON.parse(localStorage.getItem("todayTodoList"));
      todayTodoList=toSortByPriority(todayTodoList);
      let todayList = document.getElementsByClassName("list_items")[0];
      todayList.innerHTML = "";
      let todayNumbering = 0;
      todayTodoList.forEach((itemData, i) => {
        todayNumbering++;
        todayList.innerHTML += ` <div class="list_item">
          <div class="wrapping_word" >${todayNumbering}. ${itemData.name}</div>
          <div>${itemData.date}</div>
          <div>${itemData.priority}</div>
          <div>
            <span
              ><img data-todo-Array="todayTodoList" data-id=${itemData.id} onclick="todoCompleted(event)" width="25" src="./check-circle 1@2x.png" alt="" srcset=""
              /></span>
              <span><img data-todo-Array="todayTodoList" id=${itemData.id} onclick="todoDelete(event)" width="25" src="./trash 1.png" alt="" /></span>
          </div>
        </div>`;
      });
    }
    console.log(todayTodoList);
  }
  if (future) {
    if (localStorage.getItem("futureTodoList")) {
      futureTodoList = JSON.parse(localStorage.getItem("futureTodoList"));
       futureTodoList=toSortByPriority(futureTodoList);
      let futureList = document.getElementsByClassName("list_items")[1];
      futureList.innerHTML = "";
      let futureNumbering = 0;
      futureTodoList.forEach((itemData, i) => {
        futureNumbering++;
        futureList.innerHTML += ` <div class="list_item">
          <div class="wrapping_word">${futureNumbering}. ${itemData.name}</div>
          <div>${itemData.date}</div>
          <div>${itemData.priority}</div>
          <div>
            <span
              ><img data-todo-Array="futureTodoList" data-id="${itemData.id}" onclick="todoCompleted(event)" width="25" src="./check-circle 1@2x.png" alt="" srcset=""
            /></span>
            <span><img data-todo-Array="futureTodoList" id=${itemData.id} onclick="todoDelete(event)" width="25" src="./trash 1.png" alt="" /></span>
          </div>
        </div>`;
      });
    }

    console.log(futureTodoList);
  }
  if (completed) {
    if (localStorage.getItem("completedTodoList")) {
      completedTodoList = JSON.parse(localStorage.getItem("completedTodoList"));
       completedTodoList=toSortByPriority(completedTodoList);
      let completedList = document.getElementsByClassName("list_items")[2];
      completedList.innerHTML = "";
      let completedNumbering = 0;
      completedTodoList.forEach((itemData, i) => {
        completedNumbering++;
        completedList.innerHTML += ` <div class="list_item" id="completed">
          <div class="wrapping_word">${completedNumbering}. ${itemData.name}</div>
          <div>${itemData.date}</div>
          <div>${itemData.priority}</div>
          <div>
            <span><img style="filter: invert(1);" data-todo-Array="completedTodoList" id=${itemData.id} onclick="todoDelete(event)" width="25" src="./trash 1.png" alt="" /></span>
          </div>
        </div>`;
      });
    }
    console.log(completedTodoList);
  }
}
window.addEventListener("load", () => {
  render(1, 1, 1);
});

function toSortByPriority(task){
        return task.sort((a,b) => {
            const priority_order = { high: 3, medium: 2, low: 1};
            return priority_order[b.priority] - priority_order[a.priority];
        })
    }

function todoCompleted(event) {
    // console.log(event.target.dataset.todoArray);
  if (localStorage.getItem(event.target.dataset.todoArray)) {
    let x = JSON.parse(localStorage.getItem(event.target.dataset.todoArray));
    console.log(event.target.dataset.id);
    let y = x.filter((elem, i) => {
      return event.target.dataset.id != elem.id;
    });
    //  console.log(event.target)
    localStorage.setItem(event.target.dataset.todoArray, JSON.stringify(y));
    y = x.filter((elem, i) => {
      return event.target.dataset.id == elem.id;
    });
    completedTodoList = completedTodoList.concat(y);
    localStorage.setItem(
      "completedTodoList",
      JSON.stringify(completedTodoList)
    );
    if(event.target.dataset.todoArray=="todayTodoList")
    render(1, 0, 1);
    else
    if(event.target.dataset.todoArray=="futureTodoList")
        render(0,1,1);
    console.log(x);
  }
}

function todoDelete(event) {
  let x = JSON.parse(localStorage.getItem(event.target.dataset.todoArray));
  console.log(x);
  x = x.filter((elem, i) => {
    return event.target.id != elem.id;
  });
  localStorage.setItem(event.target.dataset.todoArray, JSON.stringify(x));
  if (event.target.dataset.todoArray == "todayTodoList") {
    render(1,0,0);
  } else if (event.target.dataset.todoArray == "futureTodoList") {
    render(0,1,0);
  }
  else
  {
    render(0,0,1)
  }

  console.log(x);

//   event.target.parentNode.parentNode.parentNode.remove();
}
