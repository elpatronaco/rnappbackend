import * as express from 'express'
const router = express.Router()

router.get('/', (req: express.Request, res: express.Response) => {
  res.status(200)
  res.send('Connexió correcta')
})
router.use('/user', require('./user'))

module.exports = router
