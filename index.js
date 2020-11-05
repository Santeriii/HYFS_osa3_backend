require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const PhoneNumber = require('./models/phoneNumber')
const { response } = require('express')

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-type] :body - :req[content-length]'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => {
  PhoneNumber.find({}).then(numbers => {
    res.json(numbers)
  })
})

app.get('/api/persons/:id', (request, response) => {
    PhoneNumber.findById(request.params.id).then(person => {
      response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
  const requestBody = request.body

  if (requestBody.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  const person = new PhoneNumber ({
    name: requestBody.name,
    number: requestBody.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><br/>${Date()}`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})