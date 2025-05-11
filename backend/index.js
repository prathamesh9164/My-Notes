const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())


// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`i-Notebook Backend listening on port ${port}`)
})

app.use('/api/file', require('./routes/fileConverter'));


// const convertRoute = require('./routes/convert');
// app.use('/api/convert', convertRoute);
