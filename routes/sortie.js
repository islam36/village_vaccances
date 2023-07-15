const router = require("express").Router();
const { getAllSortie, addSortie } = require("../controllers/sortie")

router.get("/", getAllSortie);
router.post("/", addSortie);

module.exports = router;