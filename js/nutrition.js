document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("nutrition-form");

    loadNutrition();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const date = document.getElementById("nutrition-date").value;
        const meal = document.getElementById("meal").value;
        const food = document.getElementById("food").value.trim();
        const calories = Number(
            document.getElementById("nutrition-calories").value
        );

        if (!date || !meal || food.length < 2 || calories < 0) {
            document.getElementById("nutrition-message").innerHTML =
                `<div class="error">Please complete all fields correctly.</div>`;
            return;
        }

        try {
            const response = await fetch("/api/nutrition", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    date,
                    meal,
                    food,
                    calories
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to save meal.");
            }

            document.getElementById("nutrition-message").innerHTML =
                `<div class="success">${result.message}</div>`;

            form.reset();
            loadNutrition();

        } catch (error) {
            document.getElementById("nutrition-message").innerHTML =
                `<div class="error">${error.message}</div>`;
        }
    });
});

async function loadNutrition() {
    try {
        const response = await fetch("/api/nutrition");
        const nutrition = await response.json();

        const tbody = document.getElementById("nutrition-table-body");

        tbody.innerHTML = nutrition.map(item => `
            <tr>
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.meal)}</td>
                <td>${escapeHTML(item.food)}</td>
                <td>${item.calories}</td>
            </tr>
        `).join("");

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