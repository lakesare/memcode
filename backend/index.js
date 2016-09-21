import 'source-map-support/register';

import express from 'express';
import bodyParser from 'body-parser';

const app = express()  
const port = 3000

app.use(bodyParser.json());       // to support JSON-encoded bodies

// (global routes, because path.join didn't work after update to webpacked ES6)
// serve our static stuff like index.css
app.use(express.static('/home/lakesare/Desktop/memcode/frontend/webpacked'));




import { router as coursesRouter } from './components/courses/routes';
app.use('/api/courses', coursesRouter);

import { router as problemsRouter } from './components/problems/routes';
app.use('/api/problems', problemsRouter);



app.get('*', function (req, res) {
  res.sendFile('/home/lakesare/Desktop/memcode/frontend/webpacked/index.html');
})

app.listen(port, (err) => {  
  if (err) { console.log('something bad happened', err) }
  console.log(`server is listening on ${port}`)
})
