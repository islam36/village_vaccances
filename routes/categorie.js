const router = require("express").Router();
const { getAllCategorie,
        addCategorie,
        updateCategorie,
        deleteCategorie
} = require("../controllers/categorie");

router.get("/", getAllCategorie);
router.post("/", addCategorie);
router.put("/:code", updateCategorie);
router.delete("/:code", deleteCategorie);

module.exports = router;