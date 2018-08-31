'use strict'

class middleware {
  /**
   * creates an express middleware to respond with a compatible security.txt
   * policy
   * @param  {Object} [options={}] an option objects with security policy
   * @return {Function}            returns an express middleware function
   */
  static setup (options = {}) {
    const securityPolicy = this.formatSecurityPolicy(options)

    return (req, res, next) => {
      // Only handle requests for our intended use
      if ((req.path === '/security.txt' || req.path === '/.well-known/security.txt') &&
          req.method.toLowerCase() === 'get') {
        return res.status(200).header('Content-Type', 'text/plain').send(securityPolicy)
      }

      return next()
    }
  }

  /**
   * formats a given an options object with security policy properties
   * to output as a string
   * @param  {Object} options object with properties of a security.txt pocliy
   * @return {String}         string representation of the
   */
  static formatSecurityPolicy (options) {
    // Before applying formatting let's validate the options
    this.validatePolicyFields(options)

    let policySettingText = ''
    const policySetting = []

    if (typeof options.contact === 'string') {
      policySetting['Contact'] = [options.contact]
    } else {
      policySetting['Contact'] = options.contact
    }

    if (options.encryption) {
      policySetting['Encryption'] = options.encryption
    }

    if (options.acknowledgement) {
      policySetting['Acknowledgement'] = options.acknowledgement
    }

    if (options.signature) {
      policySetting['Signature'] = options.signature
    }

    if (options.policy) {
      policySetting['Policy'] = options.policy
    }

    if (options.hiring) {
      policySetting['Hiring'] = options.hiring
    }

    const tmpPolicyArray = []
    for (const [field, value] of Object.entries(policySetting)) {
      if (typeof value === 'object') {
        value.forEach(valueOption => {
          tmpPolicyArray.push(`${field}: ${valueOption}`)
        })
      } else {
        tmpPolicyArray.push(`${field}: ${value}`)
      }
    }

    policySettingText = tmpPolicyArray.join('\n')
    return policySettingText
  }

  /**
   * validates a security policy object confirms with standards of security.txt
   * reference: https://www.ietf.org/id/draft-foudil-securitytxt-00.txt
   * @param  {Object} options security policy object properties
   * @return {Boolean}        throws an error or returns true
   */
  static validatePolicyFields (options) {
    if (typeof options !== 'object') {
      throw new Error('express-security-txt: middleware requires an options object')
    }

    if (!options.contact) {
      throw new Error('express-security-txt: need to specify a contact property in options')
    }

    if (options.encryption) {
      if (typeof options.encryption !== 'string') {
        throw new Error('express-security-txt: invalid encyprtion property, expecting string')
      }

      if (options.encryption.toLowerCase().substr(0, 7) === 'http://') {
        throw new Error('express-security-txt: invalid encyprtion property, must be provided as HTTPS uri')
      }
    }

    if (options.acknowledgement && typeof options.acknowledgement !== 'string') {
      throw new Error('express-security-txt: invalid acknowledgement property, expecting string in options')
    }

    if (options.signature && typeof options.signature !== 'string') {
      throw new Error('express-security-txt: invalid signature property, expecting string in options')
    }

    if (options.policy && typeof options.policy !== 'string') {
      throw new Error('express-security-txt: invalid policy property, expecting string in options')
    }

    if (options.hiring && typeof options.hiring !== 'string') {
      throw new Error('express-security-txt: invalid hiring property, expecting string in options')
    }

    return true
  }
}

module.exports = middleware
