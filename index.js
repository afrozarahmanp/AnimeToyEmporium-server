const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.port || 3000;

const alltoys = require('./Data/toys.json')

app.use(cors())

app.get('/', (req, res) => {
  res.send('Toys server is runnig')
})

app.get('/alltoys', (req, res) =>{
res.send(alltoys);
})

app.get('/alltoys/:id', (req, res) =>{
    const id = req.params.id;
    const selectedToys = alltoys.find(alltoy =>alltoy._id == id);
  res.send(selectedToys);
    })

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
  })