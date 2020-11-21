describe('Open new account', () =>{
  const customer_id = 12989
  beforeEach(()=>{
    cy.login()
    cy.visit('/openaccount.htm')
  })

  it('Open new Checking account', ()=>{
    cy.get('#type').select('CHECKING')
    cy.get('#fromAccountId')
    cy.get('input[type=submit]').click()
    cy.contains('Congratulations, your account is now open.')

    cy.get('#newAccountId').then(($account_id)=>{
      const new_account = $account_id.text()
      cy.visit('/overview.htm')
      cy.contains(new_account)
    })
  })

  it('Open new Savings account', ()=> {
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

  it('New Balance is correct', ()=>{
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
      if(balance >= 0){
        balance = '$'+ balance
      }
      else{
        balance = '-$'+ Math.abs(balance)
      }
      cy.contains(balance)
    })
  })

})
