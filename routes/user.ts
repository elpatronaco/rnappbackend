import * as express from 'express'
import * as mongoose from 'mongoose'
import { userSchema } from '../schema'

const router = express.Router()

// login post
router.post('/login/:user', (req: express.Request, res: express.Response) => {
  try {
    let loginData: userSchema.ILoginData = JSON.parse(req.params['user'])
    if (!(loginData.email && loginData.password)) {
      res.status(406)
      res.send('Es necessiten els paràmetres {email, password}')
    } else {
      userSchema.default.findOne(
        { email: loginData.email, password: loginData.password },
        (error: mongoose.CallbackError, doc: userSchema.IUser | null) => {
          if (error) throw new Error(error.message)
          if (doc) {
            res.status(200)
            res.send(JSON.stringify(doc))
          } else {
            res.sendStatus(401)
          }
        }
      )
    }
  } catch (error) {
    res.status(500)
    res.send(error)
    console.error(error)
  }
})

// register post
router.post(
  '/register/:user',
  (req: express.Request, res: express.Response) => {
    try {
      let registerData: userSchema.IUserData = JSON.parse(req.params['user'])
      if (!(registerData.email && registerData.password && registerData.name)) {
        res.status(406)
        res.send('Es necessiten paràmetres {email, password, name}')
      } else {
        userSchema.default.findOne(
          { email: registerData.email },
          (error: mongoose.CallbackError, doc: userSchema.IUser | null) => {
            if (error) throw new Error(error.message)
            if (!doc) {
              userSchema.default
                .create({
                  email: registerData.email,
                  password: registerData.password,
                  name: registerData.name,
                  birthdate: registerData.birthdate,
                })
                .then((value: userSchema.IUser) => {
                  res.status(200)
                  res.send(value)
                })
                .catch((reason) => {
                  throw new Error(reason)
                })
            } else {
              res.status(409)
              res.send('El usuari ja existeix')
            }
          }
        )
      }
    } catch (error) {
      res.status(500)
      res.send(error)
      console.error(error)
    }
  }
)

router.get('/', (req: express.Request, res: express.Response) => {
  res.status(204)
  res.send('Conexión correcta')
})

export default router
