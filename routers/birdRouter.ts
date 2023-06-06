import { Router } from 'express'
import { Birds } from '../database/database'

const router = Router()

//GET - get all approved applications
router.get("/api/birds", async (req, res) => {

    const foundBirds = await Birds.findAll()
    res.send(foundBirds)

})

//GET - get bird by species
router.get("/api/birds/:species", async (req, res) => {

    const species = req.params.species

    const foundBirds = await Birds.findOne({
        where : {species : species}
    })
    res.send(foundBirds)

})

//GET - get bird by species
router.get("/api/birdsById/:id", async (req, res) => {

    const id = req.params.id

    const foundBird = await Birds.findOne({
        where : {id : id}
    })
    res.send(foundBird)

})

export default router