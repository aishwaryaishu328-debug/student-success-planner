// ------------------------------------
// Student Success Planner
// ------------------------------------

const form = document.getElementById("plannerForm");

const hoursSlider = document.getElementById("hours");
const hoursValue = document.getElementById("hoursValue");

const dashboardContent = document.getElementById("dashboardContent");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressNumber = document.querySelector(".progress-number");

let completedTasks = 0;
let totalTasks = 0;


// ------------------------------------
// Display study hours
// ------------------------------------

hoursSlider.addEventListener("input", function () {
    hoursValue.textContent = this.value;
});


// ------------------------------------
// Generate Study Plan
// ------------------------------------

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const eventType = document.getElementById("eventType").value;
    const goalName = document.getElementById("goalName").value;
    const deadline = document.getElementById("deadline").value;
    const taskInput = document.getElementById("tasks").value;
    const hours = Number(hoursSlider.value);

    const priorityElement = document.querySelector(
        'input[name="priority"]:checked'
    );

    const priority = priorityElement
        ? priorityElement.value
        : "Medium";

    if (!deadline || !taskInput) {
        alert("Please fill all the required details.");
        return;
    }

    const tasks = taskInput
        .split("\n")
        .map(task => task.trim())
        .filter(task => task.length > 0);

    if (tasks.length === 0) {
        alert("Please enter at least one task.");
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(deadline);
    endDate.setHours(0, 0, 0, 0);

    const difference =
        endDate.getTime() - today.getTime();

    let days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

    if (days < 1) {
        days = 1;
    }

    createDashboard(
        eventType,
        goalName,
        deadline,
        tasks,
        hours,
        priority,
        days
    );
});


// ------------------------------------
// Create Dashboard
// ------------------------------------

function createDashboard(
    eventType,
    goalName,
    deadline,
    tasks,
    hours,
    priority,
    days
) {

    completedTasks = 0;
    totalTasks = tasks.length;

    const schedule = generateSchedule(
        tasks,
        days,
        hours,
        priority
    );

    dashboardContent.innerHTML = `
        <div class="dashboard-card">

            <div class="dashboard-header">

                <div>
                    <span class="event-badge">
                        ${eventType}
                    </span>

                    <h3>${escapeHTML(goalName)}</h3>

                    <p>
                        Deadline:
                        ${formatDate(deadline)}
                    </p>
                </div>

                <div>
                    <strong>${priority}</strong>
                    <p>Priority</p>
                </div>

            </div>

            <div class="stats">

                <div class="stat">
                    <strong>${days}</strong>
                    <span>Days available</span>
                </div>

                <div class="stat">
                    <strong>${hours}h</strong>
                    <span>Daily study time</span>
                </div>

                <div class="stat">
                    <strong>${tasks.length}</strong>
                    <span>Total tasks</span>
                </div>

            </div>

            <h3 style="margin-bottom:15px;">
                📅 Your Smart Schedule
            </h3>

            <div class="schedule">
                ${schedule}
            </div>

        </div>
    `;

    updateProgress();

    document
        .getElementById("dashboard")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ------------------------------------
// Generate Daily Schedule
// ------------------------------------

function generateSchedule(
    tasks,
    days,
    hours,
    priority
) {

    let html = "";

    for (let day = 0; day < days; day++) {

        const date = new Date();

        date.setDate(
            date.getDate() + day
        );

        const taskIndex =
            day % tasks.length;

        const task =
            tasks[taskIndex];

        let dailyTask = task;

        // Add revision on later days
        if (day >= tasks.length) {
            dailyTask =
                "Revision + " + task;
        }

        html += `
            <div class="day">

                <div class="day-date">
                    Day ${day + 1}<br>
                    ${date.toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short"
                        }
                    )}
                </div>

                <div class="day-task">
                    <strong>${escapeHTML(dailyTask)}</strong>
                    <br>
                    <small>
                        Priority: ${priority}
                    </small>
                </div>

                <div>

                    <span class="day-hours">
                        ${hours} hrs
                    </span>

                    <br>

                    <button
                        class="complete-btn"
                        onclick="completeTask(this)"
                    >
                        ✓ Complete
                    </button>

                </div>

            </div>
        `;
    }

    return html;
}


// ------------------------------------
// Complete Task
// ------------------------------------

function completeTask(button) {

    if (button.dataset.completed === "true") {
        return;
    }

    button.dataset.completed = "true";

    button.innerHTML = "✓ Completed";

    button.style.background = "#27ae60";
    button.style.color = "white";

    completedTasks++;

    updateProgress();
}


// ------------------------------------
// Progress
// ------------------------------------

function updateProgress() {

    if (totalTasks === 0) {
        return;
    }

    let percentage =
        Math.round(
            (completedTasks / totalTasks) * 100
        );

    if (percentage > 100) {
        percentage = 100;
    }

    progressBar.style.width =
        percentage + "%";

    progressNumber.textContent =
        percentage + "%";

    if (percentage === 0) {

        progressText.textContent =
            "Start completing your tasks to track your progress.";

    } else if (percentage < 50) {

        progressText.textContent =
            "Great start! Keep going — consistency matters.";

    } else if (percentage < 100) {

        progressText.textContent =
            "You're doing great! You're more than halfway there.";

    } else {

        progressText.textContent =
            "🎉 Amazing! You completed your preparation plan!";
    }
}


// ------------------------------------
// Format Date
// ------------------------------------

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


// ------------------------------------
// Prevent HTML injection
// ------------------------------------

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
