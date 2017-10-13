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
      if (req.path === '/security.txt' && req.method.toLowerCase() === 'get') {
        return res.status(200).send(securityPolicy)
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

    policySetting['Disclosure'] = options.disclosure

    if (options.encryption) {
      policySetting['Encryption'] = options.encryption
    }

    if (options.acknowledgement) {
      policySetting['Acknowledgement'] = options.acknowledgement
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

    if (!options.disclosure || typeof options.disclosure !== 'string') {
      throw new Error('express-security-txt: need to specify a disclosure property in options')
    }

    const disclosureOption = options.disclosure.toLowerCase()
    if (disclosureOption !== 'full' && disclosureOption !== 'partial' && disclosureOption !== 'none') {
      throw new Error('express-security-txt: invalid disclosure option')
    }

    if (options.encryption) {
      if (typeof options.encryption !== 'string') {
        throw new Error('express-security-txt: invalid encyprtion property, expecting string')
      }

      if (options.encryption.toLowerCase().substr(0, 8) !== 'https://') {
        throw new Error('express-security-txt: invalid encyprtion property, must be provided as HTTPS uri')
      }
    }

    if (options.acknowledgement && typeof options.acknowledgement !== 'string') {
      throw new Error('express-security-txt: invalid acknowledgement property, expecting string in options')
    }

    return true
  }
}

module.exports = middleware
