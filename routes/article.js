const router = require("express").Router();
const {
  getAllArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticle
} = require("../controllers/article");

router.get("/", getAllArticles);
router.get("/:code", getArticle);
router.post("/", addArticle);
router.put("/:code", updateArticle);
router.delete("/:code", deleteArticle);

module.exports = router;
