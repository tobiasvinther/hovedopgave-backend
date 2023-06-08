import { Router } from "express";
import {
  Birds,
  Images,
  Locations,
  Observations,
  Users,
} from "../database/database";
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
  //Check if logged in
  if (req.session.loggedIn !== true) {
    return res
      .status(401)
      .send({ message: "you must be logged ind to submit a observation" });
  }

  //check user id
  const user: any = await Users.findOne({
    where: { id: req.session.userID },
  });
  if (!user) {
    return res.status(404).send({ message: "No user found" });
  }

  //Find bird and checks if bird is found
  const bird: any = await Birds.findOne({
    where: { species: req.body.species },
  });
  if (!bird) {
    return res.status(404).send({ message: "No bird found" });
  }

  //creates observation
  const observation: any = await Observations.create({
    date: req.body.date,
    note: req.body.note,
    birdId: bird.id,
    UserId: user.id,
  });

  //checks if observation is created
  if (!observation) {
    return res
      .status(500)
      .send({ message: "Error adding location no observation found" });
  } else {
    //Creates location if observation is created
    const location = await Locations.create({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      ObservationId: observation.id,
    });

    //if there is an image file send with request creates file
    if (req.file) {
      const file = req.file;
      const filePath = path.join("uploads", file.path + ".jpg");

      fs.rename(file.path, filePath, (error: NodeJS.ErrnoException | null) => {
        if (error) {
          console.error("Error saving image:", error);
          return res.status(500).json({ error: "Failed to save image" });
        }
      });

      const image = await Images.create({
        path: filePath,
        birdId: bird.id,
      });
      //return statemen with image file
      return res.status(200).send({
        message: "Observation save sucess with image",
        data: { observation, location, image },
      });
    }
    //return statemen if no image file
    return res.status(200).send({
      message: "Observation save sucess without image",
      data: { observation, location },
    });
  }
});

export default router;
