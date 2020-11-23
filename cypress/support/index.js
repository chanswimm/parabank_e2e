import './commands'

before(()=>{
  cy.cleanDB()
  cy.initializeDB()
  cy.registerCustomer()
  cy.logout()
})
