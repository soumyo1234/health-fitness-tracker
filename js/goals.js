document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("goal-form");

    loadGoals();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("goal-title").value.trim();
        const category = document.getElementById("goal-category").value;
        const target = Number(document.getElementById("goal-target").value);

        if (title.length < 3 || !category || target < 1) {
            document.getElementById("goal-message").innerHTML =
                `<div class="error">Please enter valid goal information.</div>`;
            return;
        }

        try {
            const response = await fetch("/api/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    category,
                    target,
                    current: 0
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to save goal.");
            }

            document.getElementById("goal-message").innerHTML =
                `<div class="success">${result.message}</div>`;

            form.reset();
            loadGoals();

        } catch (error) {
            document.getElementById("goal-message").innerHTML =
                `<div class="error">${error.message}</div>`;
        }
    });
});

async function loadGoals() {
    try {
        const response = await fetch("/api/goals");
        const goals = await response.json();

        const container = document.getElementById("goal-container");

        if (!goals.length) {
            container.innerHTML = "<p>No goals added yet.</p>";
            return;
        }

        container.innerHTML = goals.map(goal => {
            const percentage = Math.min(
                100,
                Math.round((goal.current / goal.target) * 100)
            );

            return `
                <article class="card">
                    <h3>${escapeHTML(goal.title)}</h3>
                    <p><strong>Category:</strong> ${escapeHTML(goal.category)}</p>
                    <p>Progress: ${goal.current} / ${goal.target}</p>

                    <div class="progress-bar">
                        <div class="progress-fill"
                             style="width:${percentage}%"></div>
                    </div>

                    <p>${percentage}% complete</p>
                </article>
            `;
        }).join("");

    } catch (error) {
        console.error(error);
    }
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}