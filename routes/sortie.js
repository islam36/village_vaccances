const router = require("express").Router();
const { getAllSortie, addSortie, deleteSortie } = require("../controllers/sortie")

router.get("/", getAllSortie);
router.post("/", addSortie);
router.delete("/:code", deleteSortie);

module.exports = router;