const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

describe('Accounts Overview', () =>{
  let customer_id
  beforeEach(()=>{
    cy.login()
    cy.visit('/overview.htm')
    cy.url().should('include','/overview.htm')
    cy.getCustomerId().then((customer)=>{
      customer_id = JSON.stringify(customer)
    })
  })

  it('Balance amount is correct', () =>{
    cy.getTotalBalance().then((balance)=>{
      balance=formatter.format(balance)
      cy.contains(balance)
    })
  })

  it('Only one account is opened after initial user registration', () =>{
    cy.getAccountIdList().then(body=>{
      expect(body.length).to.eq(1)
      // length is +1 because it includes 'Total'
      cy.get('tbody').find('tr').should('have.length',body.length+1)
    })
  })

  it('List of accounts is updated after creating multiple accounts', () =>{
    cy.getAccountIdList().then(body=>{
      var numofAccounts = body.length
      cy.createAccount('SAVINGS')
      cy.createAccount('CHECKING')
      numofAccounts+=2
      cy.getAccountIdList().then(res=>{
        expect(res.length).to.eq(numofAccounts)
      })
    })
  })

  it('Individual account overview',()=>{
    cy.getSingleAccount().then((account_id)=>{
      cy.contains(account_id)
      cy.get(':nth-child(1) > :nth-child(1) > .ng-binding').click()
      cy.getTransactions(account_id).then((body)=>{
        cy.get('#transactionTable').find('tr').should('have.length',body.length+1)
      })
      cy.getAccountInfo(account_id).then((body)=>{
        cy.contains(body.id)
        cy.contains(formatter.format(body.balance))
        cy.contains(body.type)
      })
    })
  })

})
