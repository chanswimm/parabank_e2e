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
    cy.request({
      method:'GET',
      url:'/services/bank/customers/'+customer_id+'/accounts',
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      var balance = 0
      for(var i=0; i < response.body.length; i++){
        balance+=response.body[i].balance;
      }
      balance=formatter.format(balance)
      cy.contains(balance)
    })
  })

  it('List of accounts is correct', () =>{
    cy.request({
      method:'GET',
      url:'/services/bank/customers/'+customer_id+'/accounts',
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      for(var i = 0; i<response.body.length;i++){
        cy.contains(response.body[i].id)
      }
    })
  })

  it('Individual account overview',()=>{
    cy.getSingleAccount().then((account_id)=>{
      console.log(account_id)
      cy.contains(account_id)
      cy.get(':nth-child(1) > :nth-child(1) > .ng-binding').click()
      cy.request({
        method:'GET',
        url:'services/bank/accounts/'+account_id+'/transactions',
        headers:{
          accept:"application/json"
        }
      }).then(response=>{
        for(var i=0; i<response.body.length; i++){
          cy.contains(response.body.[i].description)
        }
      })
      cy.request({
        method:'GET',
        url:'services/bank/accounts/'+account_id,
        headers:{
          accept:"application/json"
        }
      }).then(response=>{
        cy.contains(response.body.id)
        cy.contains(formatter.format(response.body.balance))
        cy.contains(response.body.type)
      })
    })
  })

})
