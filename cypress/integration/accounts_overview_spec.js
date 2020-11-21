describe('Accounts Overview', () =>{
  beforeEach(()=>{
    cy.login()
    cy.visit('/overview.htm')
    cy.url().should('include','/overview.htm')
  })

  it('Balance amount is correct', () =>{
    cy.getCustomerId().then((customer_id)=>{
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

  it('List of accounts is correct', () =>{
    cy.getCustomerId().then((customer_id)=>{
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
  })

})
