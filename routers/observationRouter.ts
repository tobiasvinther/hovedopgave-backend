import { Router } from "express";
import { Birds, Observations } from "../database/database";
import multer, { Multer } from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const upload: Multer = multer({ dest: "../uploads/" });

//Create the 'uploads/' folder if it doesn't exist
const uploadFolder = path.join(__dirname, "../uploads/");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

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

//POST - create new observation
router.post("/api/observations", upload.single("image"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.send(req.body);
});

export default router;
