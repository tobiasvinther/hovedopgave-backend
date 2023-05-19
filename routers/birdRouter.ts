import { Router } from 'express'
import { Birds } from '../database/database'

const router = Router()

//GET - get all approved applications
router.get("/api/birds", async (req, res) => {

    const foundBirds = await Birds.findAll()
    res.send(foundBirds)

})

export default router