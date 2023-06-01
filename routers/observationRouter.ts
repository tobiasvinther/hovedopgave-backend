import { Router } from "express";
import { Observations } from "../database/database";

const router = Router();

router;

//GET - get all observations
router.get("/api/observations", async (req, res) => {
  const foundObservations = await Observations.findAll();
  res.send(foundObservations);
});

export default router;
