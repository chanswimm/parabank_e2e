describe('User Login', () =>{
  const username = 'q'
  const password = 'q'

  it('Login as test user', () =>{
    cy.visit('/index.htm')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(password)
    cy.get('[type="submit"]').click()
    cy.url().should('include','/overview.htm')
    cy.get('#leftPanel > ul > :nth-child(8) > a').click()
  })

  it('Login with invalid credentials', () =>{
    cy.visit('/index.htm')
    cy.get('input[name=username]').type('invalid')
    cy.get('input[name=password]').type(password)
    cy.get('[type="submit"]').click()
    cy.contains('The username and password could not be verified.')
  })

  it('Login with missing username or password field', ()=>{
    cy.visit('/index.htm')
    cy.get('input[name=password]').type(password)
    cy.get('[type="submit"]').click()
    cy.contains('Please enter a username and password.')
  })

})
