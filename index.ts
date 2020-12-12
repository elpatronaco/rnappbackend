require('dotenv').config()
import * as express from 'express'
import * as mongoose from 'mongoose'
const router = require('./routes')
import cors from 'cors'
import * as graphqlHTTP from 'express-graphql'

// el servidor escoltarà en el port que declarem com a variable de procés o el 4000
const PORT = process.env.PORT || 4000
const app = express()
var db = mongoose.connection

app.use(cors())

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

console.log(db)

app.use((req: express.Request) => {
  console.log(`Petició rebuda de (${req.ip}) amb URL (${req.url})`)
})
app.use(router)
