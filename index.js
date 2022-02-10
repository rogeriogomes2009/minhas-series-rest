const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'

const User = require('./models/user')
const jwt = require ('jsonwebtoken')
const jwtSecret = 'abc123abc123abc123abc123'

const cors = require('cors')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors({
  origin: (oirgin, callback) => {
    if(origin === 'http://server2:8080') {
      callback(null, true)
    }else{
      callback(new Error('Not alowed by CORS'))
    }
  }
}))

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const series = require('./routes/series')
const users = require('./routes/users')
app.use('/series', series)
app.use('/users', users)

app.post('/auth', async (req, res) => {
  const user = req.body
  const userDb = await User.findOne({ username: user.username })
  if(userDb){
    if(userDb.password === user.password){
      const payload = {
        id: userDb._id,
        usarname: userDb.username,
        roles: userDb.roles
      }
      jwt.sign(payload, jwtSecret, (err, token) =>{
        res.send({
          success: true,
          token: token
        })
      })
    }else{
      res.send({success: false, message:'Wrong Credentials'})
    }
  }else{
    res.send({success: false, message:'Wrong Credentials'})
  }
})

const createInitialUsers = async() => {
  const total = await User.count({})
  if(total === 0){
    const user = new User({
      username: 'Rogerio',
      password: '020316ab',
      roles: ['restrito', 'admin']
    })
    await user.save()

    const user2 = new User({
      username: 'Restrito',
      password: '123456',
      roles: ['restrito']
    })
    await user2.save()
  }
}

mongoose
.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  createInitialUsers()
  app.listen(port, () => console.log('Listening...'))
})
.catch(e => console.log(e))
