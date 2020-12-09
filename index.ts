import express from 'express'
const app = express()
import mongoose from 'mongoose'
import { json, urlencoded } from 'body-parser'

import User, { IUser } from './schema/users'
import { ILoginData, IUserData } from '../src/models/common'
import register from '../src/App/register'

app.use(json())
app.use(urlencoded({ extended: true }))

// el servidor escoltarà en el port que declarem com a variable de procés o el 4000
const PORT = process.env.PORT || 4000

app.listen(PORT, function () {
  console.log(`Servidor funcionando en el puerto ${PORT}`)
})

// TODO: log every action into the log schema
/* app.use((req: req.Request) => {
  req.
}) */

// connexió a la BBDD
mongoose.connect(
  'mongodb+srv://rnappuser:iHr0yK1WaG6MwrFl@cluster0.e7dio.mongodb.net/rnapp?retryWrites=true&w=majority'
)
const connection = mongoose.connection
connection.once('open', () => {
  console.log(`Connexió a la BBDD ${connection.db.databaseName} correcta`)
})

// login post
app.post('/user/login/:user', (req: express.Request, res: express.Response) => {
  try {
    let loginData: ILoginData = JSON.parse(req.params['user'])
    if (!(loginData.email && loginData.password)) {
      res.status(406)
      res.send('Es necessiten els paràmetres {email, password}')
    } else {
      User.findOne(
        { email: loginData.email, password: loginData.password },
        (error: mongoose.CallbackError, doc: IUser | null) => {
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
app.post('/user/register/:user', (req: express.Request, res: express.Response) => {
  try {
    let registerData: IUserData = JSON.parse(req.params['user'])
    if (!(registerData.email && registerData.password && registerData.name)) {
      res.status(406)
      res.send('Es necessiten paràmetres {email, password, name}')
    } else {
      User.findOne(
        { email: registerData.email },
        (error: mongoose.CallbackError, doc: IUser | null) => {
          if (error) throw new Error(error.message)
          if (!doc) {
            User.create({
              email: registerData.email,
              password: registerData.password,
              name: registerData.name,
              birthdate: registerData.birthdate
            })
              .then((value: IUser) => {
                res.status(200)
                res.send(value)
              })
              .catch(reason => {
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
})

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`Petició rebuda de ${req.ip}`)
})
