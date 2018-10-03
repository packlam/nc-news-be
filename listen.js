const app = require('./app');

let port = process.env.port;
if (port === null || port === '') {
  port = 9090;
}

app.listen(port, err => {
  if (err) console.log(err)
  else console.log(`Listening on Port ${port}...`)
})