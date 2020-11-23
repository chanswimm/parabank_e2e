describe('Logout', () =>{
  beforeEach(()=>{
    cy.login()
  })
  it('Logout from any page', () =>{
    cy.get('#leftPanel > ul > :nth-child(8) > a').click()
    cy.url().should('include','/index.htm')
  })

  it('Logout via URL', () =>{
    cy.visit('/logout.htm')
    cy.url().should('include','/index.htm')
  })
})
