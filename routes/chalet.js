const router = require("express").Router();
const {
    getAllChalet,
    addChalet
} = require("../controllers/chalet");

router.get("/", getAllChalet);
router.post("/", addChalet);

module.exports = router;
