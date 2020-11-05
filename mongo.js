const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.blvny.mongodb.net/phone_numbers?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const numberSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

const Number = mongoose.model('Number', numberSchema)

const number = new Number({
  name: 'Arto Hellas',
  number: '040-123456',
})

const number2 = new Number({
  name: 'Ada Lovelace',
  number: '39-44-5323523',
})

const number3 = new Number({
  name: 'Dan Abramov',
  number: '12-43-234345',
})

const number4 = new Number({
  name: 'Mary Poppendieck',
  number: '39-23-6423122',
})

if (process.argv.length>3) {
  const newNumber = new Number({
    name: process.argv[3],
    number: process.argv[4],
  })
  newNumber.save().then(result => {
    console.log('number saved!')
    mongoose.connection.close()
  })
}

if (process.argv.length==3) {
  Number.find({}).then(result => {
    result.forEach(number => {
      console.log(number)
    })
    mongoose.connection.close()
  })
}