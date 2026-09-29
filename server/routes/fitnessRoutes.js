const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();

const dataPath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "fitness-data.json"
);

async function readData() {
    const rawData = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(rawData);
}

async function writeData(data) {
    await fs.writeFile(
        dataPath,
        JSON.stringify(data, null, 2),
        "utf-8"
    );
}

function createId(items) {
    if (!items.length) {
        return 1;
    }

    return Math.max(...items.map(item => Number(item.id))) + 1;
}

/* =========================
   GET ALL FITNESS DATA
========================= */

router.get("/fitness", async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to load fitness data."
        });
    }
});

/* =========================
   EXERCISE
========================= */

router.get("/exercise", async (req, res) => {
    try {
        const data = await readData();
        res.json(data.exercise);
    } catch (error) {
        res.status(500).json({
            message: "Unable to load exercise records."
        });
    }
});

router.post("/exercise", async (req, res) => {
    try {
        const {
            date,
            activity,
            duration,
            calories
        } = req.body;

        if (
            !date ||
            !activity ||
            Number(duration) < 1 ||
            Number(calories) < 0
        ) {
            return res.status(400).json({
                message: "Invalid exercise information."
            });
        }

        const data = await readData();

        const newExercise = {
            id: createId(data.exercise),
            date,
            activity: String(activity).trim(),
            duration: Number(duration),
            calories: Number(calories)
        };

        data.exercise.push(newExercise);

        await writeData(data);

        res.status(201).json({
            message: "Exercise record saved successfully.",
            record: newExercise
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error while saving exercise."
        });
    }
});

/* =========================
   NUTRITION
========================= */

router.get("/nutrition", async (req, res) => {
    try {
        const data = await readData();
        res.json(data.nutrition);
    } catch (error) {
        res.status(500).json({
            message: "Unable to load nutrition records."
        });
    }
});

router.post("/nutrition", async (req, res) => {
    try {
        const {
            date,
            meal,
            food,
            calories
        } = req.body;

        if (
            !date ||
            !meal ||
            !food ||
            Number(calories) < 0
        ) {
            return res.status(400).json({
                message: "Invalid nutrition information."
            });
        }

        const data = await readData();

        const newMeal = {
            id: createId(data.nutrition),
            date,
            meal: String(meal).trim(),
            food: String(food).trim(),
            calories: Number(calories)
        };

        data.nutrition.push(newMeal);

        await writeData(data);

        res.status(201).json({
            message: "Nutrition record saved successfully.",
            record: newMeal
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error while saving nutrition data."
        });
    }
});

/* =========================
   SLEEP
========================= */

router.get("/sleep", async (req, res) => {
    try {
        const data = await readData();
        res.json(data.sleep);
    } catch (error) {
        res.status(500).json({
            message: "Unable to load sleep records."
        });
    }
});

router.post("/sleep", async (req, res) => {
    try {
        const {
            date,
            hours,
            quality
        } = req.body;

        if (
            !date ||
            Number(hours) < 0 ||
            Number(hours) > 24 ||
            !quality
        ) {
            return res.status(400).json({
                message: "Invalid sleep information."
            });
        }

        const data = await readData();

        const newSleep = {
            id: createId(data.sleep),
            date,
            hours: Number(hours),
            quality: String(quality).trim()
        };

        data.sleep.push(newSleep);

        await writeData(data);

        res.status(201).json({
            message: "Sleep record saved successfully.",
            record: newSleep
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error while saving sleep data."
        });
    }
});

/* =========================
   GOALS
========================= */

router.get("/goals", async (req, res) => {
    try {
        const data = await readData();
        res.json(data.goals);
    } catch (error) {
        res.status(500).json({
            message: "Unable to load goals."
        });
    }
});

router.post("/goals", async (req, res) => {
    try {
        const {
            title,
            category,
            target,
            current
        } = req.body;

        if (
            !title ||
            !category ||
            Number(target) < 1 ||
            Number(current) < 0
        ) {
            return res.status(400).json({
                message: "Invalid goal information."
            });
        }

        const data = await readData();

        const newGoal = {
            id: createId(data.goals),
            title: String(title).trim(),
            category: String(category).trim(),
            target: Number(target),
            current: Number(current)
        };

        data.goals.push(newGoal);

        await writeData(data);

        res.status(201).json({
            message: "Goal saved successfully.",
            record: newGoal
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error while saving goal."
        });
    }
});

module.exports = router;