import { Router } from 'express'
import { Users } from '../database/database'
const bcrypt = require('bcrypt'); 


const router = Router()

//GET - get all approved applications
router.get("/api/users", async (req, res) => {
    const foundUsers = await Users.findAll()
    res.send(foundUsers)

})
// User login
router.post("/api/login", async (req, res) => {  
    const email: string = 'bw@wayneinterprise.com';
    const password: number = 1234;
    console.log(email);
    console.log(password);
    const user = await Users.findOne({
        where: {
            email: email,
            password: password
        }
    });
    if(!user){
        res.status(402).send("User not found!")
    } else {
        res.status(200).send("User is logged in!")
    }

});

router.post('/api/register', async (req, res) => {
    const today = new Date().toDateString()
    const hashPassword = await bcrypt.hash("1234", 12)
    const userData: {
        firstName: string,
        lastName: string,
        email: string,
        password: number,
        datetime: string
      } = {
        firstName: "Dirty",
        lastName: "Harry",
        email: "dh@harry.com",
        password: hashPassword,
        datetime: today
      };
      
      Users.findOne({
          where: {
              email: "dh@harry.com"
          }
      })
        .then((user: any) => {
          if (!user) {
            Users.create(userData)
              .then((user: any) => {
                res.json({ status: user.email + ' ' + 'REGISTERED' })
              })
              .catch((err: any) => {
                res.send('ERROR: ' + err)
              })
          } else {
            res.json({ error: "USER ALREADY EXISTS" })
          }
        })
        .catch((err: any) => {
          res.send('ERROR: ' + err)
        })
      });


export default router