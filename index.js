require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const PhoneNumber = require('./models/phoneNumber')
const { response } = require('express')

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-type] :body - :req[content-length]'))
app.use(cors())

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

app.get('/api/persons/:id', (request, response, next) => {
    PhoneNumber.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    PhoneNumber.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><br/>${Date()}`)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  PhoneNumber.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})