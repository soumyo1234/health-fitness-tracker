document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sleep-form");

    loadSleep();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const date = document.getElementById("sleep-date").value;
        const hours = Number(document.getElementById("sleep-hours").value);
        const quality = document.getElementById("sleep-quality").value;

        if (!date || hours < 0 || hours > 24 || !quality) {
            document.getElementById("sleep-message").innerHTML =
                `<div class="error">Please provide valid sleep information.</div>`;
            return;
        }

        try {
            const response = await fetch("/api/sleep", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    date,
                    hours,
                    quality
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to save sleep record.");
            }

            document.getElementById("sleep-message").innerHTML =
                `<div class="success">${result.message}</div>`;

            form.reset();
            loadSleep();

        } catch (error) {
            document.getElementById("sleep-message").innerHTML =
                `<div class="error">${error.message}</div>`;
        }
    });
});

async function loadSleep() {
    try {
        const response = await fetch("/api/sleep");
        const records = await response.json();

        const tbody = document.getElementById("sleep-table-body");

        tbody.innerHTML = records.map(item => `
            <tr>
                <td>${escapeHTML(item.date)}</td>
                <td>${item.hours}</td>
                <td>${escapeHTML(item.quality)}</td>
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