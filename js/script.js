const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const deleteAllBtn = document.getElementById("delete-all");

// Statistik
const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const pendingTasksEl = document.getElementById("pending-tasks");
const progressEl = document.getElementById("progress");

let tasks = [];

// Tambah task
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskText = todoInput.value.trim();
    const taskDate = dateInput.value;

    if (taskText === "" || taskDate === "") return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        date: taskDate,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();

    // reset input
    todoInput.value = "";
    dateInput.value = "";
});

// Render tasks ke tabel
function renderTasks(filter = "all") {
    todoList.innerHTML = "";

    let filteredTasks = tasks;
    if (filter === "pending") {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (filter === "completed") {
        filteredTasks = tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="4" class="empty">No tasks found</td>`;
        todoList.appendChild(row);
    } else {
        filteredTasks.forEach(task => {
            const row = document.createElement("tr");

            row.innerHTML = `
        <td>${task.text}</td>
        <td>${task.date}</td>
        <td class="${task.completed ? "status-complete" : "status-pending"}">
          ${task.completed ? "Completed" : "Pending"}
        </td>
        <td>
          <button class="action-btn complete">${task.completed ? "Undo" : "Done"}</button>
          <button class="action-btn delete">Delete</button>
        </td>
      `;

            // Aksi tombol Done/Undo
            row.querySelector(".complete").addEventListener("click", () => {
                task.completed = !task.completed;
                renderTasks(filter);
            });

            // Aksi tombol Delete
            row.querySelector(".delete").addEventListener("click", () => {
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks(filter);
            });

            todoList.appendChild(row);
        });
    }

    updateStats();
}

// Update statistik
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    progressEl.textContent = progress + "%";
}

// Delete All
deleteAllBtn.addEventListener("click", () => {
    tasks = [];
    renderTasks();
});

// === Filter Dropdown ===
const filterBtn = document.getElementById("filter-btn");
const dropdown = document.querySelector(".dropdown");
const filterMenu = document.getElementById("filter-menu");

filterBtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
});

filterMenu.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        const filterValue = btn.getAttribute("data-filter");
        renderTasks(filterValue);
        dropdown.classList.remove("show");
        filterBtn.textContent = `Filter (${btn.textContent}) ▼`;
    });
});

// Render awal
renderTasks();
