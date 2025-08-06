const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const deleteAllBtn = document.getElementById("delete-all-btn");

let todos = [];

function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4" class="no-task">No task found</td>`;
    todoList.appendChild(row);
    return;
  }

  todos.forEach((todo, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>${todo.done ? "Done" : "Pending"}</td>
      <td>
        <button onclick="toggleStatus(${index})">✓</button>
        <button onclick="deleteTodo(${index})">🗑</button>
      </td>
    `;
    todoList.appendChild(row);
  });
}

function addTodo() {
  const task = todoInput.value.trim();
  const date = dateInput.value;

  if (task === "" || date === "") {
    alert("Please enter both task and date.");
    return;
  }

  todos.push({ task, date, done: false });
  todoInput.value = "";
  dateInput.value = "";
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

function toggleStatus(index) {
  todos[index].done = !todos[index].done;
  renderTodos();
}

function deleteAll() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todos = [];
    renderTodos();
  }
}

addBtn.addEventListener("click", addTodo);
deleteAllBtn.addEventListener("click", deleteAll);

// Initial render
renderTodos();
