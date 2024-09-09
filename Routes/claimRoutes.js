const express = require('express');

const router = express.Router();

const claimController = require("../Controllers/claimController");

router.post("/addClaim",claimController.addClaim);

router.get("/getAllClaims",claimController.getAllClaims);

router.post("/getClaimDetails",claimController.getClaimDetails);

router.get("/getSpecificClaim",claimController.getSpecificClaim);

router.put("/updateClaimDetails",claimController.updateClaimDetails);

router.put("/updateVehicleDetails",claimController.updateVehicleDetails);

router.put("/updateDriverDetails",claimController.updateDriverDetails);

router.put("/updategarageDetails",claimController.garageDetails);

router.put("/updateAccidentDetails",claimController.accidentdetails);

router.put("/updateClaim/:leadId",claimController.updateClaim);

module.exports = router;



