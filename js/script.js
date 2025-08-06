const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");
const filterStatus = document.getElementById("filterStatus");
const deleteAllBtn = document.getElementById("deleteAllBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos(filter = "all") {
  todoList.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    return filter === "completed" ? todo.completed : !todo.completed;
  });

  filteredTodos.forEach((todo, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="px-4 py-2">${todo.task}</td>
      <td class="px-4 py-2">${todo.date}</td>
      <td class="px-4 py-2">
        <span class="${todo.completed ? "text-green-400" : "text-yellow-400"}">
          ${todo.completed ? "Completed" : "Pending"}
        </span>
      </td>
      <td class="px-4 py-2">
  <div class="flex gap-2 justify-center">
    <button onclick="toggleStatus(${index})" class="text-sm bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white">
      Toggle
    </button>
    <button onclick="deleteTodo(${index})" class="text-sm bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white">
      Delete
    </button>
  </div>
</td>

    `;

    todoList.appendChild(tr);
  });
}

function toggleStatus(index) {
  todos[index].completed = !todos[index].completed;
  saveToLocalStorage();
  renderTodos(filterStatus.value);
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveToLocalStorage();
  renderTodos(filterStatus.value);
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (!task || !date) return;

  todos.push({ task, date, completed: false });
  taskInput.value = "";
  dateInput.value = "";

  saveToLocalStorage();
  renderTodos(filterStatus.value);
});

filterStatus.addEventListener("change", () => renderTodos(filterStatus.value));

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todos = [];
    saveToLocalStorage();
    renderTodos();
  }
});

// Initial render
renderTodos(filterStatus.value);
