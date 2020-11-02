const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
  const requestBody = request.body

  if (!requestBody.name) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  persons.map(person => {
    if (person.name === requestBody.name) {
      return response.status(400).json({ 
        error: 'name already in list' 
      })
    }
  })

  const id = Math.floor(Math.random() * 99999999)

  const person = {
    name: requestBody.name,
    number: requestBody.number,
    id: id,
  }

  console.log(person)

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><br/>${Date()}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})