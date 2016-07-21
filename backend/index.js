// 'use strict'

import express from 'express';
// const express = require('express');
const app = express()  
const port = 3000

import { db } from './db/init.js';



app.get('/api', (request, response) => {  
  response.send('Hello from Express!')
});

app.get('/api/courses/:id', (request, response) => {
  const problems = db.any('select * from problems where courseId = ${courseId}', 
    { 
      courseId: request.params.id
    })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((data) => {
      response.status(500).json({ error: data.message });
    })
});

app.get('/api/courses', (request, response) => {
  const courses = db.any("select * from courses")
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((data) => {
      response.status(500).json({ error: data.message });
    })
});





// global routes cause path.join didn't work after update to webpacked ES6
// serve our static stuff like index.css
app.use(express.static('/home/lakesare/Desktop/memcode/frontend/webpacked'));

app.get('*', function (req, res) {
  res.sendFile('/home/lakesare/Desktop/memcode/frontend/webpacked/index.html');
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})


