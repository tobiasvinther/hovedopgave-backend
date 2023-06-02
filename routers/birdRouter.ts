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

export default router