'use strict'
const express = require('express')  
const app = express()  
const port = 3000


app.get('/api', (request, response) => {  
  response.send('Hello from Express!')
})

app.get('/api/courses/:id/problems', (request, response) => {  
  response.json({
    problems: [
      {
        id: 1,
        explanation: 'some context to a problem',
        answerIds: [1, 2]
      }
    ],
    answers: [
      {
        id: 1,
        precedingText: 'first answer is',
        answer: 'hi',
        answered: null //'right', 'wrong', null
      },
      {
        id: 2,
        precedingText: 'second answer is',
        answer: 'hello',
        answered: null //'right', 'wrong', null
      },
      {
        id: 3,
        precedingText: 'first answer is',
        answer: 'second problem!',
        answered: null //'right', 'wrong', null
      }
    ]
  });
});

app.get('/api/courses', (request, response) => {  
  response.json(
    [
      {
        id: 1,
        title: 'Ruby',
        imageUrl: 'http://placehold.it/150x100'
      },
      {
        id: 2,
        title: 'Js',
        imageUrl: 'http://placehold.it/150x100'
      }
    ]
  );
});


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


