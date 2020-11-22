describe('Transfer Funds', () =>{
  let from_acc
  let to_acc
  beforeEach(()=>{
    cy.login()
    cy.visit('/transfer.htm')
    cy.getTwoAccounts().then((accounts)=>{
      to_acc = JSON.stringify(accounts[0])
      from_acc = JSON.stringify(accounts[1])
    })
  })

  it('Error for Missing Transfer amount', () =>{
    cy.get('[type="submit"]').click()
    cy.contains('The amount cannot be empty.')
  })

  it('Error for Invalid type for amount', () =>{
    cy.get('#amount').type('abc')
    cy.get('[type="submit"]').click()
    cy.contains('Please enter a valid amount')

    cy.request({
      method:'POST',
      url:'/services/bank/transfer?fromAccountId='+from_acc+'&toAccountId='+to_acc+'&amount=abc',
      failOnStatusCode:false,
      headers:{
        accept:"application/json"
      }
    })
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
