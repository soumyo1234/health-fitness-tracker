const express = require("express");
const path = require("path");

const fitnessRoutes = require("./routes/fitnessRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json({ limit: "100kb" }));

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

/* =========================
   API ROUTES
========================= */

app.use("/api", fitnessRoutes);

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );
});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
    console.log(
        `Health & Fitness Tracker running at http://localhost:${PORT}`
    );
});