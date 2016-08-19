import express from 'express';
import bodyParser from 'body-parser';

const app = express()  
const port = 3000

app.use( bodyParser.json() );       // to support JSON-encoded bodies

// (global routes, because path.join didn't work after update to webpacked ES6)
// serve our static stuff like index.css
app.use(express.static('/home/lakesare/Desktop/memcode/frontend/webpacked'));




import { router } from './components/courses/routes';
app.use('/api/courses', router);





app.get('*', function (req, res) {
  res.sendFile('/home/lakesare/Desktop/memcode/frontend/webpacked/index.html');
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
