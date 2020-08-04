import {
  Server,
  Model,
  Factory,
  belongsTo,
  hasMany,
  association,
  RestSerializer,
} from 'miragejs'

import { nanoid } from '@reduxjs/toolkit'

import faker from 'faker'
// import { parseISO } from 'date-fns'
// import seedrandom from 'seedrandom'

const IdSerializer = RestSerializer.extend({
  serializeIds: 'always',
})

// Set up a seeded random number generator, so that we get
// a consistent set of users / entries each time the page loads.
// This can be reset by deleting this localStorage value,
// or turned off by setting `useSeededRNG` to false.
let useSeededRNG = true

// let rng = faker.random.number();

if (useSeededRNG) {
  let randomSeedString = localStorage.getItem('randomTimestampSeed')
  let seedDate

  if (randomSeedString) {
    seedDate = new Date(randomSeedString)
  } else {
    seedDate = new Date()
    randomSeedString = seedDate.toISOString()
    localStorage.setItem('randomTimestampSeed', randomSeedString)
  }

  // rng = faker.random.number(randomSeedString);
  faker.seed(seedDate.getTime())
}

new Server({
  routes() {
    this.namespace = 'fakeApi'
    this.timing = 2000

    this.resource('users')
    this.resource('contacts')

    const server = this

    this.post('/users', function (schema, req) {
      const data = this.normalizedRequestAttrs()
      data.date = new Date().toISOString()
      // Work around some odd behavior by Mirage that's causing an extra
      // user entry to be created unexpectedly when we only supply a userId.
      // It really want an entire Model passed in as data.user for some reason.
      const user = schema.users.find(data.userId)
      data.user = user

      if (data.content === 'error') {
        throw new Error('Could not save user!')
      }

      const result = server.create('user', data)
      return result
    })

    this.get('/users/:userId/contacts', (schema, req) => {
      const post = schema.posts.find(req.params.postId)
      return post.contacts
    })
  },

  models: {
    user: Model.extend({
      contacts: hasMany(),
    }),

    contact: Model.extend({
      user: belongsTo(),
    }),
  },
  
  factories: {
    user: Factory.extend({
      id() {
        return nanoid()
      },
      firstName() {
        return faker.name.firstName()
      },
      lastName() {
        return faker.name.lastName()
      },
      name() {
        return faker.name.findName(this.firstName, this.lastName)
      },
      username() {
        return faker.internet.userName(this.firstName, this.lastName)
      },
      phone() {
        return faker.phone.phoneNumber()
      },

      afterCreate(user, server) {
        server.createList('contact', 3, { user })
      },
    }),
    contact: Factory.extend({
      id() {
        return nanoid()
      },
      phone() {
        return faker.phone.phoneNumber()
      }, 
      email() {
        return faker.internet.email()
      },
      user: association(),
    }),
  },
  serializers: {
    user: IdSerializer,
    contact: IdSerializer,
  },
  seeds(server) {
    server.createList('user',12)
  },
})
