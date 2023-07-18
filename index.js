const express = require("express");
const categorieRouter = require("./routes/categorie")
const articleRouter = require("./routes/article")
const entreeRouter = require("./routes/entree")
const sortieRouter = require("./routes/sortie")

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/api/categorie", categorieRouter);
app.use("/api/article", articleRouter);
app.use("/api/entree", entreeRouter);
app.use("/api/sortie", sortieRouter);




app.get("/", async (req, res) => {
    res.send("hello world");
})

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})

