const router = require("express").Router();
const {
    getAllReservation,
    addReservation,
    getReservation,
    updateReservation
} = require("../controllers/reservation");

router.get("/", getAllReservation);
router.post("/", addReservation);
router.get("/:code", getReservation);
router.put("/:code", updateReservation);

module.exports = router;
