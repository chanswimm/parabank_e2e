import './commands'

before(()=>{
  cy.cleanDB()
  cy.initalizeDB()
})
