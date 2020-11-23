var username = 'q'
var password = 'q'

Cypress.Commands.add('login', () =>{
  cy.visit('/index.htm')
  cy.get('input[name=username]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get(':nth-child(5) > .button').click()
})

Cypress.Commands.add('getCustomerId', ()=>{
  cy.request({
    method:'GET',
    url:'/services/bank/login/'+username+'/'+password,
    headers:{
      accept:"application/json"
    }
  }).then(response=>{
    return(response.body.id)
  })
})

Cypress.Commands.add('getTwoAccounts', ()=>{
  cy.getCustomerId().then((customer_id)=>{
    cy.request({
      method:'GET',
      url:'/services/bank/customers/'+customer_id+'/accounts',
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      var accounts=[]
      if(response.body.length == 1){
        accounts[0]=response.body.[0].id
        accounts[1]=response.body.[0].id
      }
      else{
        accounts[0]=response.body.[0].id
        accounts[1]=response.body.[1].id
      }
      return(accounts)
    })
  })
})

Cypress.Commands.add('getSingleAccount',()=>{
  cy.getCustomerId().then((customer_id)=>{
    cy.request({
      method:'GET',
      url:'/services/bank/customers/'+customer_id+'/accounts',
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      return(response.body.[0].id)
    })
  })
})

Cypress.Commands.add('getTransactionId',()=>{
  cy.getSingleAccount().then((account_id)=>{
    cy.request({
      method:'GET',
      url:'/services/bank/accounts/'+account_id+'/transactions',
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      return(response.body[0].id)
    })
  })
})

Cypress.Commands.add('getLoginInformation',()=>{
  var user=[username,password]
  return(user)
})

Cypress.Commands.add('getBalance',(account_id)=>{
  cy.getAccountInfo(account_id).then((body)=>{
    return(body.balance)
  })
})

Cypress.Commands.add('getAccountInfo',(account_id)=>{
  cy.request({
    method:'GET',
    url:'/services/bank/accounts/'+account_id,
    headers:{
      accept:"application/json"
    }
  }).then(response=>{
    return(response.body)
  })
})

Cypress.Commands.add('getTransactions',(account_id)=>{
  cy.request({
    method:'GET',
    url:'/services/bank/accounts/'+account_id+'/transactions',
    headers:{
      accept:"application/json"
    }
  }).then((response)=>{
    return(response.body)
  })
})
