'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect
// const sinon = require('sinon')
// const sinonChai = require('sinon-chai')
// chai.use(sinonChai)
chai.should()
const HttpMocks = require('node-mocks-http')

const LDP = require('../../lib/ldp')
const SolidHost = require('../../lib/models/solid-host')
const AccountManager = require('../../lib/models/account-manager')
const testAccountsDir = path.join(__dirname, '..', 'resources', 'accounts')
const ResourceMapper = require('../../lib/resource-mapper')

const api = require('../../lib/api/accounts/user-accounts')

let host

beforeEach(() => {
  host = SolidHost.from({ serverUri: 'https://example.com' })
})

describe('api/accounts/user-accounts', () => {
  describe('newCertificate()', () => {
    describe('in multi user mode', () => {
      const multiuser = true
      const resourceMapper = new ResourceMapper({
        rootUrl: 'https://localhost:8443/',
        includeHost: multiuser,
        rootPath: testAccountsDir
      })
      const store = new LDP({ multiuser, resourceMapper })

      it('should throw a 400 error if spkac param is missing', done => {
        const options = { host, store, multiuser, authMethod: 'oidc' }
        const accountManager = AccountManager.from(options)

        const req = {
          body: {
            webid: 'https://alice.example.com/#me'
          },
          session: { userId: 'https://alice.example.com/#me' },
          get: () => { return 'https://example.com' }
        }
        const res = HttpMocks.createResponse()

        const newCertificate = api.newCertificate(accountManager)

        newCertificate(req, res, (err) => {
          expect(err.status).to.equal(400)
          expect(err.message).to.equal('Missing spkac parameter')
          done()
        })
      })
    })
  })
})
