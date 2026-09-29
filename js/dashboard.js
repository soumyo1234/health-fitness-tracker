document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
    try {
        const response = await fetch("/api/fitness");

        if (!response.ok) {
            throw new Error("Unable to load fitness data.");
        }

        const data = await response.json();

        const totalExercise = data.exercise.length;

        const totalDuration = data.exercise.reduce(
            (sum, item) => sum + Number(item.duration),
            0
        );

        const totalBurned = data.exercise.reduce(
            (sum, item) => sum + Number(item.calories),
            0
        );

        const averageSleep =
            data.sleep.length > 0
                ? (
                    data.sleep.reduce(
                        (sum, item) => sum + Number(item.hours),
                        0
                    ) / data.sleep.length
                ).toFixed(1)
                : "0";

        document.getElementById("total-exercise").textContent = totalExercise;
        document.getElementById("total-duration").textContent = totalDuration;
        document.getElementById("total-burned").textContent = totalBurned;
        document.getElementById("average-sleep").textContent = averageSleep;

        renderRecentExercise(data.exercise);
        renderNutritionSummary(data.nutrition);
        renderGoalSummary(data.goals);

    } catch (error) {
        console.error(error);

        document.getElementById("recent-exercise").textContent =
            "Unable to load data.";

        document.getElementById("nutrition-summary").textContent =
            "Unable to load data.";

        document.getElementById("goal-summary").textContent =
            "Unable to load data.";
    }
}

function renderRecentExercise(exercises) {
    const container = document.getElementById("recent-exercise");

    if (!exercises.length) {
        container.textContent = "No exercise records available.";
        return;
    }

    const recent = [...exercises].slice(-3).reverse();

    container.innerHTML = recent.map(item => `
        <p>
            <strong>${escapeHTML(item.activity)}</strong><br>
            ${item.duration} minutes · ${item.calories} calories
        </p>
    `).join("");
}

function renderNutritionSummary(nutrition) {
    const container = document.getElementById("nutrition-summary");

    const calories = nutrition.reduce(
        (sum, item) => sum + Number(item.calories),
        0
    );

    container.innerHTML = `
        <p><strong>Total recorded calories:</strong> ${calories}</p>
        <p><strong>Meals recorded:</strong> ${nutrition.length}</p>
        <a href="nutrition.html" class="btn">View Nutrition</a>
    `;
}

function renderGoalSummary(goals) {
    const container = document.getElementById("goal-summary");

    if (!goals.length) {
        container.textContent = "No goals available.";
        return;
    }

    container.innerHTML = goals.map(goal => {
        const percent = Math.min(
            100,
            Math.round((goal.current / goal.target) * 100)
        );

        return `
            <div style="margin-bottom: 18px;">
                <strong>${escapeHTML(goal.title)}</strong>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${percent}%"></div>
                </div>
                <small>${percent}% complete</small>
            </div>
        `;
    }).join("");
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}