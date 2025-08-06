// JavaScript for the To-Do List App
const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");
const filterStatus = document.getElementById("filterStatus");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeIcon = document.getElementById("darkModeIcon");
const darkModeText = document.getElementById("darkModeText");

// Modal elements
const confirmationModal = document.getElementById("confirmationModal");
const confirmYesBtn = document.getElementById("confirmYesBtn");
const confirmNoBtn = document.getElementById("confirmNoBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

/**
 * Saves the current todos array to localStorage.
 */
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

/**
 * Applies the selected theme (dark or light) to the body.
 * @param {string} theme - 'dark' or 'light'.
 */
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    darkModeIcon.textContent = "🌙";
    darkModeText.textContent = "Dark Mode";
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    darkModeIcon.textContent = "☀️";
    darkModeText.textContent = "Light Mode";
  }
}

/**
 * Toggles the theme between dark and light.
 */
function toggleTheme() {
  if (document.body.classList.contains("dark")) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
}

/**
 * Renders the list of todos based on the selected filter.
 * @param {string} filter - The current filter ('all', 'completed', 'pending').
 */
function renderTodos(filter = "all") {
  todoList.innerHTML = ""; // Clear existing tasks

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    return filter === "completed" ? todo.completed : !todo.completed;
  });

  filteredTodos.forEach((todo, index) => {
    const tr = document.createElement("tr");
    // Apply different hover colors based on theme
    tr.classList.add("task-item");
    if (document.body.classList.contains("dark")) {
      tr.classList.add("hover:bg-gray-700");
    } else {
      tr.classList.add(
        "hover:bg-blue-100"
      ); /* New hover color for light mode */
    }

    tr.innerHTML = `
                    <td class="px-4 py-2 sm:px-5 sm:py-3">${todo.task}</td>
                    <td class="px-4 py-2 sm:px-5 sm:py-3">${todo.date}</td>
                    <td class="px-4 py-2 sm:px-5 sm:py-3">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                          todo.completed
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }">
                            ${todo.completed ? "Completed" : "Pending"}
                        </span>
                    </td>
                    <td class="px-4 py-2 sm:px-5 sm:py-3">
                        <div class="flex gap-2 justify-center">
                            <button onclick="toggleStatus(${index})" class="icon-button bg-green-600 hover:bg-green-700 text-white transition duration-200 ease-in-out transform hover:scale-110 shadow-sm">
                                ${todo.completed ? "⏳" : "✅"}
                            </button>
                            <button onclick="deleteTodo(${index})" class="icon-button bg-red-600 hover:bg-red-700 text-white transition duration-200 ease-in-out transform hover:scale-110 shadow-sm">
                                🗑️
                            </button>
                        </div>
                    </td>
                `;

    todoList.appendChild(tr);
  });
}

/**
 * Toggles the completion status of a todo item.
 * @param {number} index - The index of the todo item in the todos array.
 */
function toggleStatus(index) {
  todos[index].completed = !todos[index].completed;
  saveToLocalStorage();
  renderTodos(filterStatus.value);
}

/**
 * Deletes a todo item from the list.
 * @param {number} index - The index of the todo item in the todos array.
 */
function deleteTodo(index) {
  todos.splice(index, 1);
  saveToLocalStorage();
  renderTodos(filterStatus.value);
}

// Event listener for adding a new task
todoForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (!task || !date) return; // Do not add empty tasks

  todos.push({ task, date, completed: false });
  taskInput.value = ""; // Clear input fields
  dateInput.value = "";

  saveToLocalStorage();
  renderTodos(filterStatus.value);
});

// Event listener for changing the filter status
filterStatus.addEventListener("change", () => renderTodos(filterStatus.value));

// Event listener for the "Delete All" button
deleteAllBtn.addEventListener("click", () => {
  // Show the custom confirmation modal instead of confirm()
  confirmationModal.classList.add("show");
});

// Event listener for "Yes" button in the confirmation modal
confirmYesBtn.addEventListener("click", () => {
  todos = []; // Clear all tasks
  saveToLocalStorage();
  renderTodos();
  confirmationModal.classList.remove("show"); // Hide modal after action
});

// Event listener for "No" button in the confirmation modal
confirmNoBtn.addEventListener("click", () => {
  confirmationModal.classList.remove("show"); // Just hide modal
});

// Event listener for dark mode toggle button
darkModeToggle.addEventListener("click", toggleTheme);

// Initial theme application based on localStorage or system preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  applyTheme(savedTheme);
} else if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  // Check system preference if no theme is saved
  applyTheme("dark");
} else {
  applyTheme("light"); // Default to light mode
}

// Re-render todos whenever the theme changes to apply correct hover styles
const observer = new MutationObserver(() => {
  renderTodos(filterStatus.value);
});
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"],
});

// Initial render of todos when the page loads
renderTodos(filterStatus.value);
