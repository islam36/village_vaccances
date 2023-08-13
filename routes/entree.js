const router = require("express").Router();
const { getAllEntree, addEntree, deleteEntree } = require("../controllers/entree")

router.get("/", getAllEntree);
router.post("/", addEntree);
router.delete("/:code", deleteEntree);

module.exports = router;