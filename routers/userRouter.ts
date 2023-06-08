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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
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
                const userCreated = { userCreated: true }
                console.log(userCreated)
                res.send(userCreated)
              })
              .catch((err: any) => {
                res.send('ERROR: ' + err)
              })
          } else {
            const userExists = { userExists: true}
            res.send(userExists)
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
  
  
  if(!email || !password || email==="" || password==="") {
    res.sendStatus(404); 
  }
  
  try {
    const user: any = await Users.findOne({
      where: {
          email: email,
      }
  });
    if(!user) {
      console.log("User or password not found!")
      const message = { failed: 'failed to login!' }
        res.send(message);
    } else {
      const encryptedPassword = user.password; 
      const passwordComparison = await bcrypt.compare(password, encryptedPassword)
      console.log("Password match:", passwordComparison);

      req.session.loggedIn = true
    

      if(passwordComparison === true) {
        //const sessionData = req.session.loggedIn
        console.log(req.session)
        res.send({ loginSuccess: req.session.loggedIn }) //{ sessionData: sessionData }
      } else {
        console.log("Password failed!");
        res.send({ passwordfailed: "Password failed!" })
      }
  }
  } catch {
     console.error()
  }

});  
    

router.get("/api/logout", (req,res) => {
  // Destroying the session
  req.session.destroy(() => {
  console.log(req.session)
  res.send({ sessionDestroyed: true })
  })
  /*
  req.session.destroy((error) => {
    if(error) {
      console.error('Failed til destroy the session:', error)
    }else {
      console.log('Session destroyed!')
      console.log(req.session)
    }
    res.send({ sessionDestroyed: true })
  })*/
});

router.get('/check-session', (req, res) => {
  console.log(req.session.loggedIn)
  if (req.session.loggedIn) {
    // Session is created
    res.status(200).json({ message: 'Session exists' });
  } else {
    // Session is not created
    res.status(401).json({ message: 'Session does not exist' });
  }
});

//check if user is logged in, then send applications
router.get("/api/authenticate", async (req, res) => {
  if(!req.session.loggedIn) {
      res.sendStatus(401)
  } else {
      res.sendStatus(200)
  }
})

export default router