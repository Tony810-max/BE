const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const app = express()
const cors = require('cors');

app.use(cors());


app.use(express.json());

//route
const route = require('./routes')
route(app)

//connect to database
const db = require('./config/db')
db.connect()

// Sử dụng middleware body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})