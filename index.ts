require('dotenv').config()
import * as express from 'express'
import * as mongoose from 'mongoose'
import * as expGraphql from 'express-graphql'
import { buildSchema } from 'graphql'
import User, { ILoginData } from './schema/users/users'
import { path } from 'express/lib/application'
import { IUser, IUserData } from './schema/users/users'

// el servidor escoltarà en el port que declarem com a variable de procés o el 4000
const PORT = process.env.PORT || 4000
const app = express()

app.listen(PORT, () => {
  console.log(`Servidor funcionant al port ${PORT}`)
})

// connexió a la BBDD
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((value: typeof mongoose) => {
    console.log(
      `Connexió a la BBDD ${value.connection.db.databaseName} correcta`
    )

    mongoose.set('useNewUrlParser', true)
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
  })
  .catch((reason) => {
    console.error(`ERROR: No s'ha pogut connectar a la BBDD. Raó: ${reason}`)
  })

const loginUser = (query: ILoginData) => {
  console.log(query)
  return User.findOne(
    { email: query.email, password: query.password },
    (doc: IUser, err: mongoose.NativeError) => {
      if (!err) {
        return doc
      } else {
        return err
      }
    }
  )
}

const registerUser = (query: IUserData) => {
  return User.create(
    {
      email: query.email,
      password: query.password,
      name: query.name,
      birthdate: query.birthdate,
    },
    (err: mongoose.NativeError, doc: IUserData) => {
      if (!err) {
        return doc
      } else {
        console.error(err)
        return err
      }
    }
  )
}

let schema = buildSchema(`
    type Query {
      hello: String
      loginUser(email: String!, password: String!): User
      registerUser(email: String!, password: String!, name: String!, birthdate: String): User
    }
    type User {
      email: String!
      password: String!
      name: String!
      birthdate: String
    }
    type Log {
      event: String!
      logDate: String
      User: [User!]!
  }
  `)

let root = {
  hello: () => 'Hello world',
  loginUser: loginUser,
  registerUser: registerUser,
}

app.use(
  '/graphql',
  expGraphql.graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
