const express = require("express");
const path = require("path");
const categorieRouter = require("./routes/categorie")
const articleRouter = require("./routes/article")
const entreeRouter = require("./routes/entree")
const sortieRouter = require("./routes/sortie")
const chaletRouter = require("./routes/chalet")
const reservationRouter = require("./routes/reservation")
const cors = require("cors")

const app = express();
const PORT = 8000;

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}]  ${req.method} ${req.url}`);
    next();
});

app.use("/api/categorie", categorieRouter);
app.use("/api/article", articleRouter);
app.use("/api/entree", entreeRouter);
app.use("/api/sortie", sortieRouter);
app.use("/api/chalet", chaletRouter);
app.use("/api/reservation", reservationRouter);
app.use("/api/close", (req, res, next) => {
    process.exit(1);
})

app.use(express.static(path.join("front", "dist")));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "front", "dist", "index.html"));
})




// app.get("/", async (req, res) => {
//     res.send("hello world");
// })

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})

