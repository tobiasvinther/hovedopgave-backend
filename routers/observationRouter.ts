import { Router } from "express";
import { Birds, Observations } from "../database/database";

const router = Router();

router;

//GET - get all observations
router.get("/api/observations", async (req, res) => {
  const foundObservations = await Observations.findAll();
  res.send(foundObservations);
});

//GET - get all observations for specific bird
router.get("/api/observations/:species", async (req, res) => {
  const species = req.params.species;

  const foundBird = await Birds.findOne({
    where: { species: species },
  });
  if (!foundBird) {
    return res.status(404).send("No bird found");
  }
  const foundObservations = await Observations.findAll({
    where: { birdId: foundBird.getDataValue("id") },
  });
  res.status(200).send(foundObservations);
});

export default router;
