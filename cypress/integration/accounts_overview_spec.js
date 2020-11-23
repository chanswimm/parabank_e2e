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
      cy.createAccount('SAVINGS')
      cy.createAccount('CHECKING')
    })
  })

  it('List of accounts is correct', () =>{
    cy.getAccountIdList().then(list=>{
      for(var i = 0; i< list.length;i++){
        cy.contains(list[i])
      }
    })
  })

  it('Individual account overview',()=>{
    cy.getSingleAccount().then((account_id)=>{
      console.log(account_id)
      cy.contains(account_id)
      cy.get(':nth-child(1) > :nth-child(1) > .ng-binding').click()
      cy.getTransactions(account_id).then((body)=>{
        for(var i=0; i<body.length; i++){
          cy.contains(body.[i].description)
        }
      })
      cy.getAccountInfo(account_id).then((body)=>{
        cy.contains(body.id)
        cy.contains(formatter.format(body.balance))
        cy.contains(body.type)
      })
    })
  })

})
