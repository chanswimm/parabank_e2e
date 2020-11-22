const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

describe('Open new account', () =>{
  beforeEach(()=>{
    cy.login()
    cy.visit('/openaccount.htm')
  })

  it('Open new Checking account', ()=>{
    cy.getCustomerId().then((customer_id)=>{
      cy.getSingleAccount().then((from_acc)=>{
        cy.get('#type').select('CHECKING')
        cy.get('#fromAccountId').select(JSON.stringify(from_acc))
        cy.get('input[type=submit]').click()
        cy.contains('Congratulations, your account is now open.')

        cy.get('#newAccountId').then(($account_id)=>{
          const new_account = $account_id.text()
          cy.visit('/overview.htm')
          cy.contains(new_account)
        })
      })
    })
  })

  it('Open new Savings account', ()=> {
    cy.getCustomerId().then((customer_id)=>{
      cy.get('#type').select('SAVINGS')
      cy.get('#fromAccountId')
      cy.get('input[type=submit]').click()
      cy.contains('Congratulations, your account is now open.')

      cy.get('#newAccountId').then(($account_id)=>{
        const new_account = $account_id.text()
        cy.visit('/overview.htm')
        cy.contains(new_account)
      })
    })
  })

  it('New Balance is correct', ()=>{
    cy.getCustomerId().then((customer_id)=>{
      cy.visit('/overview.htm')
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
  })

})
