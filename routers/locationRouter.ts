import { Router } from 'express'
import { Locations } from '../database/database'

const router = Router()

//GET - get location by ObservationId
router.get("/api/locations/:ObservationId", async (req, res) => {

    const ObservationId = req.params.ObservationId

    const foundLocation = await Locations.findOne({
        where : {ObservationId : ObservationId}
    })
    console.log("FOUND LOCATION:", foundLocation)
    res.send(foundLocation)

})

export default router