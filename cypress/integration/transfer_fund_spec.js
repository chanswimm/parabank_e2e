describe('Transfer Funds', () =>{
  const to_acc = '15231'
  const from_acc = '15564'
  beforeEach(()=>{
    cy.login()
    cy.visit('/transfer.htm')
  })

  it('Missing Transfer amount', () =>{
    cy.get('#fromAccountId').select(from_acc)
    cy.get('#toAccountId').select(to_acc)
    cy.get('[type="submit"]').click()
    cy.contains('The amount cannot be empty.')
  })

  it('Invalid type for amount', () =>{
    cy.get('#amount').type('abc')
    cy.get('[type="submit"]').click()
    cy.contains('Please enter a valid amount')
  })

  it('Transfer Funds from accountA to accountB', ()=>{
    cy.get('#amount').type('100')
    cy.get('#fromAccountId').select(from_acc)
    cy.get('#toAccountId').select(to_acc)
    cy.get('[type="submit"]').click()

    cy.contains('Transfer Complete!')
    cy.request('GET','/services/bank/accounts/' + to_acc +'/transactions').its('body').should('include','Funds Transfer Received')
    cy.request('GET','/services/bank/accounts/' + from_acc +'/transactions').its('body').should('include','Funds Transfer Sent')
  })
})
