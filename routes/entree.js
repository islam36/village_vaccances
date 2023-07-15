const router = require("express").Router();
const { getAllEntree, addEntree } = require("../controllers/entree")

router.get("/", getAllEntree);
router.post("/", addEntree);

module.exports = router;