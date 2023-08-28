const router = require("express").Router();
const {
    getAllChalet,
    addChalet,
    deleteChalet
} = require("../controllers/chalet");

router.get("/", getAllChalet);
router.post("/", addChalet);
router.delete("/:code", deleteChalet);

module.exports = router;
