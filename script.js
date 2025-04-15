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
      const now = new Date();
      const day = now.toLocaleDateString("en-US", { weekday: "long" });
      const date = now
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .join("/");
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      tasks.unshift({
        title,
        summary,
        completed: false,
        notCompleted: false,
        animated: false,
        addedDay: day,
        addedDate: date,
        addedTime: time,
        remark: "",
        hasSubmittedRemark: false, // Track submission status
      });
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
    let currentDay = null;
    tasks.forEach((task, index) => {
      if (task.addedDay !== currentDay) {
        const dayHeader = document.createElement("div");
        dayHeader.className = "day-header";
        dayHeader.innerHTML = `
          <h3>${task.addedDay}</h3>
          <p>${task.addedDate}</p>
        `;
        taskList.appendChild(dayHeader);
        currentDay = task.addedDay;
      }

      const div = document.createElement("div");
      div.className = `task-card ${task.completed ? "completed" : ""} ${
        task.notCompleted ? "not-completed" : ""
      }`;
      div.innerHTML = `
        <header>
          <h2>${task.title}</h2>
        </header>
        <div class="summary">${task.summary || "No summary"}</div>
        <div class="status">
          <label><input type="checkbox" class="completed-checkbox" ${
            task.completed ? "checked" : ""
          }> Completed</label>
          <label><input type="checkbox" class="not-completed-checkbox" ${
            task.notCompleted ? "checked" : ""
          }> Not Completed</label>
        </div>
        <div class="remark-section" style="display: ${
          task.notCompleted ? "block" : "none"
        };">
          ${
            task.notCompleted && !task.hasSubmittedRemark
              ? `
                <div class="remark-input-container">
                  <input type="text" class="remark-input" placeholder="Reason for not completing" aria-label="Reason">
                  <button class="remark-submit">Submit</button>
                </div>
              `
              : ""
          }
          <div class="remark-display">${
            task.remark && task.hasSubmittedRemark
              ? `Reason: ${task.remark}`
              : ""
          }</div>
        </div>
        <div class="actions">
          <button class="toggle-btn">▼</button>
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>${
                      task.addedTime
                    }</span></button>
        </div>
        <div class="decorative-grass"></div>
        <div class="decorative-grass"></div>
      `;

      const completedCheckbox = div.querySelector(".completed-checkbox");
      const notCompletedCheckbox = div.querySelector(".not-completed-checkbox");
      const remarkInput = div.querySelector(".remark-input");
      const remarkSubmit = div.querySelector(".remark-submit");

      completedCheckbox.addEventListener("change", () => {
        const taskCard = div;
        const wasCompleted = tasks[index].completed;
        tasks[index].completed = completedCheckbox.checked;
        tasks[index].notCompleted = false;
        tasks[index].animated = tasks[index].animated || !wasCompleted;
        tasks[index].remark = "";
        tasks[index].hasSubmittedRemark = false;
        saveTasks();

        taskCard.classList.toggle("completed", tasks[index].completed);
        taskCard.classList.toggle("not-completed", tasks[index].notCompleted);
        taskCard.querySelector(".remark-section").style.display = "none";
        if (tasks[index].completed && !wasCompleted) {
          createConfetti(taskCard);
        }

        setTimeout(() => {
          renderTasks();
        }, 1500);
      });

      notCompletedCheckbox.addEventListener("change", () => {
        tasks[index].notCompleted = notCompletedCheckbox.checked;
        tasks[index].completed = false;
        tasks[index].animated = false;
        if (!tasks[index].notCompleted) {
          tasks[index].remark = "";
          tasks[index].hasSubmittedRemark = false;
        }
        saveTasks();
        renderTasks();
      });

      if (remarkSubmit) {
        remarkSubmit.addEventListener("click", () => {
          const reason = remarkInput.value.trim();
          tasks[index].remark = reason;
          tasks[index].hasSubmittedRemark = reason !== ""; // Only true if reason is non-empty
          saveTasks();
          renderTasks();
        });
      }

      div.querySelector(".toggle-btn").addEventListener("click", () => {
        div.classList.toggle("active");
      });

      div.querySelector(".edit-btn").addEventListener("click", () => {
        const newTitle = prompt("Edit title:", task.title);
        const newSummary = prompt("Edit summary:", task.summary);
        const newRemark = task.notCompleted
          ? prompt("Edit reason:", task.remark)
          : task.remark;
        if (newTitle && newTitle.trim()) {
          tasks[index].title = newTitle.trim();
          tasks[index].summary = newSummary?.trim() || task.summary;
          tasks[index].remark = newRemark?.trim() || task.remark;
          tasks[index].hasSubmittedRemark =
            task.notCompleted && (newRemark?.trim() || task.remark)
              ? true
              : false;
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

  function createConfetti(taskCard) {
    const confettiCount = 15;
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.background = `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})`;
      confetti.style.width = `${6 + Math.random() * 6}px`;
      const height = 15 + Math.random() * 10;
      confetti.style.height = `${height}px`;
      confetti.style.animationDelay = `${i * 0.1}s`;
      taskCard.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1500);
    }
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});
