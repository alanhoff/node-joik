'use strict'

const Joi = require('joi')
const expect = require('code').expect
const lab = exports.lab = require('lab').script()

const Joik = require('../')

lab.describe('general tests', () => {
  lab.test('should correctly setup Joi', cb => {
    const store = new Joik(Joi)
    expect(store.Joi).to.equal(Joi)

    cb()
  })

  lab.test('should store a new rule in the registry', cb => {
    const store = new Joik(Joi)

    store.rule('user', Joi => Joi.object({
      name: Joi.string(),
      username: Joi.string()
    }))

    const rule = store.rule('user')
    expect(rule.isJoi).to.be.true()

    cb()
  })

  lab.test('should throw for unknown rules', cb => {
    const store = new Joik(Joi)

    expect(() => store.rule('woops')).to.throw('Unknown rule \'woops\'')

    cb()
  })

  lab.test('should throw for unknown schemas', cb => {
    const store = new Joik(Joi)

    expect(() => store.schema('woops')).to.throw('Unknown schema \'woops\'')

    cb()
  })

  lab.test('should store a new schema in the registry', cb => {
    const store = new Joik(Joi)

    store.rule('user', Joi => Joi.object({
      name: Joi.string().required(),
      username: Joi.string().required()
    }))

    store.schema('user-reply', (Joi, store) => Joi.object({
      data: store.rule('user'),
      created_at: Joi.date().iso()
    }))

    store.schema('user-reply-without-password', (Joi, store) => store.schema('user-reply')
      .concat(Joi.object({
        password: Joi.forbidden()
      })))

    const schema = store.schema('user-reply-without-password')
    expect(schema.isJoi).to.be.true()
    expect(() => Joi.assert({
      data: {
        name: 'Alan',
        username: 'alan'
      },
      created_at: new Date()
    }, schema)).to.not.throw()

    cb()
  })
})
