document.addEventListener("DOMContentLoaded", () => {
  const taskTitle = document.getElementById("task-title");
  const taskSummary = document.getElementById("task-summary");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  addTaskBtn.addEventListener("click", () => {
    const title = taskTitle.value.trim();
    const summary = taskSummary.value.trim();
    if (title) {
      tasks.push({ title, summary, completed: false });
      saveTasks();
      renderTasks();
      taskTitle.value = "";
      taskSummary.value = "";
    }
  });

  taskTitle.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTaskBtn.click();
  });

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = `task-card ${task.completed ? "completed" : ""}`;
      div.innerHTML = `
                <header>
                    <h2>${task.title}</h2>
                    <input type="checkbox" ${task.completed ? "checked" : ""}>
                </header>
                <div class="summary">${task.summary || "No summary"}</div>
                <div class="actions">
                    <button class="toggle-btn">▼</button>
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
                <div class="decorative-grass"></div>
                <div class="decorative-grass"></div>
            `;

      div
        .querySelector('input[type="checkbox"]')
        .addEventListener("change", () => {
          tasks[index].completed = !tasks[index].completed;
          saveTasks();
          renderTasks();
        });

      div.querySelector(".toggle-btn").addEventListener("click", () => {
        div.classList.toggle("active");
      });

      div.querySelector(".edit-btn").addEventListener("click", () => {
        const newTitle = prompt("Edit title:", task.title);
        const newSummary = prompt("Edit summary:", task.summary);
        if (newTitle && newTitle.trim()) {
          tasks[index].title = newTitle.trim();
          tasks[index].summary = newSummary?.trim() || task.summary;
          saveTasks();
          renderTasks();
        }
      });

      div.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      taskList.appendChild(div);
    });
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
