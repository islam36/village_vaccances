const router = require("express").Router();
const {
    getAllReservation,
    addReservation,
    getReservation,
    updateReservationStatus,
    deleteReservation
} = require("../controllers/reservation");

router.get("/", getAllReservation);
router.post("/", addReservation);
router.get("/:code", getReservation);
router.put("/status/:code", updateReservationStatus);
router.delete("/:code", deleteReservation);

module.exports = router;
