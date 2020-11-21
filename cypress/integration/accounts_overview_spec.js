describe('Accounts Overview', () =>{
  beforeEach(()=>{
    cy.login({username:'q', password:'q'})
    cy.visit('/overview.htm')
  })

  it('Balance amount is correct', () =>{
    cy.visit('/overview.htm')
  })

})
