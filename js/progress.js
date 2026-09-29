document.addEventListener("DOMContentLoaded", loadProgress);

async function loadProgress() {
    try {
        const response = await fetch("/api/fitness");
        const data = await response.json();

        createExerciseChart(data.exercise);
        createSleepChart(data.sleep);

    } catch (error) {
        console.error("Progress data error:", error);
    }
}

function createExerciseChart(exerciseData) {
    const labels = exerciseData.map(item => item.date);
    const values = exerciseData.map(item => item.duration);

    const ctx = document.getElementById("exerciseChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Exercise Duration (minutes)",
                    data: values
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

function createSleepChart(sleepData) {
    const labels = sleepData.map(item => item.date);
    const values = sleepData.map(item => item.hours);

    const ctx = document.getElementById("sleepChart");

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Sleep Duration (hours)",
                    data: values,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}