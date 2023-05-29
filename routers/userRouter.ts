import { Router } from 'express'
import { Users } from '../database/database'
import bcrypt from 'bcrypt'

 

const router = Router()

//GET - get all approved applications
router.get("/api/users", async (req, res) => {
    const foundUsers = await Users.findAll()
    res.send(foundUsers)

})

// User register
router.post('/api/register', async (req, res) => {
    const today = new Date().toDateString()
    const hashPassword = await bcrypt.hash(req.body.password, 12)
    const userData: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        datetime: string
      } = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: hashPassword,
        datetime: today
      };
      
      Users.findOne({
          where: {
              email: req.body.email
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

// User login
router.post("/api/login", async (req, res) => {  
  const email: string = req.body.email; // 'bw@wayneinterprise.com'
  const password: string = req.body.password; // "1234"
  console.log(email);
  console.log(password);
  const user: any = await Users.findOne({
      where: {
          email: email,
      }
  });

  if(!user) {
    res.status(402).send("User or password not found!")
    console.log("User or password not found!")
  }
  try {
    const authorized = await bcrypt.compare(password, user.password)

  if(!user && !authorized){
      res.status(402).send("User or password not found!")
      console.log("User or password not found!")
  } else {
      res.status(200).send("User is logged in!")
      console.log("User logged in!")
  }
  } catch(error) {
    console.log("Error!", error) 
  }
});      

router.post("/api/logout", (req,res) => {
  // Clear the session
  req.session.destroy((error) => {
    if(error) {
      console.log('Error destroying session!', error)
    }
    // Redirect the user to the login page
    res.redirect('/api/login'); 
  });
});

export default router