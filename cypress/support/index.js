import './commands'

before(()=>{
  cy.log('Initializing database')
  cy.cleanDB()
  cy.initializeDB()
  cy.registerCustomer()
  cy.logout()
})
