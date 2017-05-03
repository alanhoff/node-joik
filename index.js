'use strict'

module.exports = class Joik {
  /**
   * Constructs a new Joik instance
   * @param {Object} Joi The Joi object that should be used
   * @return {Joik}
   */
  constructor (Joi) {
    /**
     * The Joi instance that should be used
     * @type {Object}
     */
    this.Joi = Joi

    /**
     * A place for storing rules
     * @type {Map}
     */
    this.rules = new Map()

    /**
     * A place to store schemas
     * @type {Map}
     */
    this.schemas = new Map()
  }

  /**
   * Stores a new rule or build a previously stored one
   * @param {String} name The name of the rule to be stored
   * @param {Function} [rule] The function used to build the rule
   * @return {Undefined|Object} Returns `undefined` if creating a new rule or
   * a Joi object if retrieving one
   */
  rule (name, rule) {
    const { Joi } = this

    Joi.assert({ name, rule }, Joi.object({
      name: Joi.string().required(),
      rule: Joi.func().arity(1).optional()
    }))

    if (rule) {
      this.rules.set(name, rule)
    } else {
      if (!this.rules.has(name)) {
        throw new Error(`Unknown rule '${name}'`)
      } else {
        return this.rules.get(name)(Joi)
      }
    }
  }

  /**
   * Stores a new schema or build a previously stored one
   * @param {String} name The name of the schema to be stored
   * @param {Function} [schema] The function used to build the schema
   * @return {Undefined|Object} Returns `undefined` if creating a new schema or
   * a Joi object if retrieving one
   */
  schema (name, schema) {
    const { Joi } = this

    Joi.assert({ name, schema }, Joi.object({
      name: Joi.string().required(),
      schema: Joi.func().minArity(1).maxArity(2).optional()
    }))

    if (schema) {
      this.schemas.set(name, schema)
    } else {
      if (!this.schemas.has(name)) {
        throw new Error(`Unknown schema '${name}'`)
      } else {
        return this.schemas.get(name)(Joi, this)
      }
    }
  }
}
