const router = require("express").Router();
const {
  getAllArticles,
  addArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/article");

router.get("/", getAllArticles);
router.post("/", addArticle);
router.put("/:code", updateArticle);
router.delete("/:code", deleteArticle);

module.exports = router;
