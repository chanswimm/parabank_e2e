describe('Logout', () =>{
  beforeEach(()=>{
    cy.login({username:'q', password:'q'})
  })
  it('Logout from any page', () =>{
    cy.get('#leftPanel > ul > :nth-child(8) > a').click()
    cy.url().should('include','/index.htm')
  })
})
