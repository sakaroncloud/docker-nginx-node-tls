const express = require('express')
const os = require('os');
const path = require('path');

require('dotenv').config()
const app = express()
app.use(express.static(path.join(__dirname, '/')));

const PORT = process.env.SERVER_PORT || 8000; // Use environment variable or default to 8000



app.get('/', (req, res) => {
  res.sendFile(__dirname+"/index.html")
})

app.get('/server-info', (req, res) => {
  res.json({
      hostname: os.hostname(),
      port: PORT
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})