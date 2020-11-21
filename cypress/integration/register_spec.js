describe('The Register Page', () => {
  beforeEach(()=>{
    cy.visit('/register.htm')
    cy.visit('/register.htm')
    cy.get('[name="customer\.firstName"]').focus().type('First')
    cy.get('[name="customer\.lastName"]').focus().type('Last')
    cy.get('[name="customer\.address\.street"]').focus().type('123 Street')
    cy.get('[name="customer\.address\.city"]').focus().type('Scranton')
    cy.get('[name="customer\.address\.state"]').focus().type('Pennsylvania')
    cy.get('[name="customer\.address\.zipCode"]').focus().type('07362')
    cy.get('[name="customer\.phoneNumber"]').focus().type('6047838888')
    cy.get('[name="customer\.ssn"]').focus().type('545121111')
    cy.get('[name="customer\.username"]').focus().type('test_user_1')
    cy.get('[name="customer\.password"]').focus().type('Testing123')
    cy.get('[name="repeatedPassword"]').focus().type('Testing123')
  })

  it('Username taken', () => {
    cy.get('[colspan="2"] > .button').click()
    cy.contains('This username already exists.')
  })

  it('Missing some required fields', () =>{
    cy.get('[name="customer\.address\.zipCode"]').focus().clear()
    cy.get('[colspan="2"] > .button').click()
    cy.contains('Zip Code is required')

  })

  it('Account registered successfully', () =>{
    cy.get('[name="customer\.username"]').focus().clear().type('test_user_4')
    cy.get('[colspan="2"] > .button').click()
    cy.contains('Your account was created successfully. You are now logged in')
    cy.get('.title').should('contain','test_user_4')
  })
})
