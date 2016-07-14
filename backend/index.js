'use strict'
const express = require('express')  
const app = express()  
const port = 3000


app.get('/api', (request, response) => {  
  response.send('Hello from Express!')
})

const path = require('path');


// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, '../frontend/webpacked/')))

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../frontend/webpacked/', 'index.html'))
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})


