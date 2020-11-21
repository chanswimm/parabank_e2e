Cypress.Commands.add('login', () =>{
  cy.visit('/index.htm')
  cy.get('input[name=username]').type('beans_test')
  cy.get('input[name=password]').type('123')
  cy.get(':nth-child(5) > .button').click()
})
