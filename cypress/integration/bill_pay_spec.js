describe('Bill payment service', () =>{
  const payee_name = 'payee 1'
  const from_acc = '15231'
  beforeEach(()=>{
    cy.login()
    cy.visit('/billpay.htm')
    cy.get('[name="payee\.name"]').focus().type(payee_name)
    cy.get('[name="payee\.address.street"]').focus().type('street')
    cy.get('[name="payee\.address.city"]').focus().type('city')
    cy.get('[name="payee\.address.state"]').focus().type('state')
    cy.get('[name="payee\.address.zipCode"]').focus().type('00000')
    cy.get('[name="payee\.phoneNumber"]').focus().type('5450009999')
    cy.get('[name="payee\.accountNumber"]').focus().type('12345')
    cy.get('[name="verifyAccount"]').focus().type('12345')
    cy.get('[name="amount"]').focus().type('12.32')
    cy.get('[name="fromAccountId"]').select(from_acc)
  })

  it('Missing Payee infomration', () =>{
    cy.get('[name="payee\.name"]').focus().clear()
    cy.get('input[type="submit"]').click()
    cy.contains('Payee name is required')
  })

  it('Mismatch between Payee account number', ()=> {
    cy.get('[name="verifyAccount"]').focus().clear().type('00000')
    cy.get('input[type="submit"]').click()
    cy.contains('The account numbers do not match')
  })

  it('Missing amount', () =>{
    cy.get('[name="amount"]').focus().clear()
    cy.get('input[type="submit"]').click()
    cy.contains('The amount cannot be empty')
  })

  it('Invalid type for account number and amount', () =>{
    cy.get('[name="payee\.accountNumber"]').focus().type('zzzz')
    cy.get('[name="verifyAccount"]').focus().type('zzzz')
    cy.get('[name="amount"]').focus().clear().type('abc')
    cy.get('input[type="submit"]').click()
    cy.contains('Please enter a valid amount')
    cy.contains('Please enter a valid number')
  })

  it('Bill payment successful', () =>{
    cy.get('input[type="submit"]').click()
    cy.contains('Bill Payment Complete')
    cy.request('GET','/services/bank/accounts/'+ from_acc + '/transactions').its('body').should('include','Bill Payment to ' + payee_name)
  })

})
