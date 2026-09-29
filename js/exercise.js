document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("exercise-form");

    loadExercises();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearErrors();

        const date = document.getElementById("exercise-date").value;
        const activity = document.getElementById("activity").value.trim();
        const duration = Number(document.getElementById("duration").value);
        const calories = Number(document.getElementById("calories").value);

        let valid = true;

        if (!date) {
            showError("date-error", "Please select a date.");
            valid = false;
        }

        if (activity.length < 2) {
            showError("activity-error", "Activity must contain at least 2 characters.");
            valid = false;
        }

        if (duration < 1 || duration > 600) {
            showError("duration-error", "Duration must be between 1 and 600 minutes.");
            valid = false;
        }

        if (calories < 0 || calories > 5000) {
            showError("calories-error", "Calories must be between 0 and 5000.");
            valid = false;
        }

        if (!valid) {
            return;
        }

        try {
            const response = await fetch("/api/exercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    date,
                    activity,
                    duration,
                    calories
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to save exercise.");
            }

            document.getElementById("exercise-message").innerHTML =
                `<div class="success">${result.message}</div>`;

            form.reset();
            loadExercises();

        } catch (error) {
            document.getElementById("exercise-message").innerHTML =
                `<div class="error">${error.message}</div>`;
        }
    });
});

async function loadExercises() {
    try {
        const response = await fetch("/api/exercise");
        const exercises = await response.json();

        const tbody = document.getElementById("exercise-table-body");

        tbody.innerHTML = exercises.map(item => `
            <tr>
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.activity)}</td>
                <td>${item.duration} min</td>
                <td>${item.calories}</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error(error);
    }
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(element => {
        element.textContent = "";
    });
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}