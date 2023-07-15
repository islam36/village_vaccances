const express = require("express");
const categorieRouter = require("./routes/categorie")
const articleRouter = require("./routes/article")
const entreeRouter = require("./routes/entree")
const sortieRouter = require("./routes/sortie")

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/categorie", categorieRouter);
app.use("/article", articleRouter);
app.use("/entree", entreeRouter);
app.use("/sortie", sortieRouter);




app.get("/", async (req, res) => {
    res.send("hello world");
})

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})

