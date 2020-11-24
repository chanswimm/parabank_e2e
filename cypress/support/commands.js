var username = Math.random().toString(36).substr(2, 9)
var password = Math.random().toString(36).substr(2, 9)

Cypress.Commands.add('login', () =>{
  cy.visit('/index.htm')
  cy.get('input[name=username]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get(':nth-child(5) > .button').click()
})

Cypress.Commands.add('registerCustomer', () =>{
  cy.visit('/register.htm')
  cy.get('[name="customer\.firstName"]').focus().type('first_name')
  cy.get('[name="customer\.lastName"]').focus().type('last_name')
  cy.get('[name="customer\.address\.street"]').focus().type('address_street')
  cy.get('[name="customer\.address\.city"]').focus().type('address_city')
  cy.get('[name="customer\.address\.state"]').focus().type('address_state')
  cy.get('[name="customer\.address\.zipCode"]').focus().type('address_zip_code')
  cy.get('[name="customer\.phoneNumber"]').focus().type('6048988888')
  cy.get('[name="customer\.ssn"]').focus().type('5654443333')
  cy.get('[name="customer\.username"]').focus().type(username)
  cy.get('[name="customer\.password"]').focus().type(password)
  cy.get('[name="repeatedPassword"]').focus().type(password)
  cy.get('[colspan="2"] > .button').click()
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

Cypress.Commands.add('getCustomerDetails', ()=>{
  cy.getCustomerId().then(customer_id=>{
    cy.request({
      method:'GET',
      url:'/services/bank/customers/'+customer_id,
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      expect(response.status).to.eq(200)
      return(response.body)
    })
  })
})

Cypress.Commands.add('createAccount',(type) =>{
  var type_id
  if(type == 'CHECKING'){type_id = 0}
  else if(type == 'SAVINGS'){type_id=1}
  else(type_id=2)
  cy.getCustomerId().then((customer_id)=>{
    cy.getSingleAccount().then((from_acc)=>{
      cy.request({
        method:'POST',
        url:'/services/bank/createAccount?customerId='+customer_id+'&newAccountType='+type_id+'&fromAccountId='+from_acc,
        headers:{
          accept:"application/json"
        }
      })
    })
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

Cypress.Commands.add('getTotalBalance',()=>{
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
      return balance
    })
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

Cypress.Commands.add('cleanDB',()=>{
  cy.request({
    method:'POST',
    url:'/services/bank/cleanDB',
    headers:{
      accept:"application/json"
    }
  }).then((response)=>{
    expect(response.status).to.eq(204)
  })
})

Cypress.Commands.add('initializeDB',()=>{
  cy.request({
    method:'POST',
    url:'/services/bank/initializeDB',
    headers:{
      accept:"application/json"
    }
  }).then((response)=>{
    expect(response.status).to.eq(204)
  })
})

Cypress.Commands.add('logout',()=>{
  cy.visit('/logout.htm')
})

Cypress.Commands.add('transferFunds',(from_acc,to_acc,amount)=>{
  cy.request({
    method:'POST',
    url:'/services/bank/transfer?fromAccountId='+from_acc+'&toAccountId='+to_acc+'&amount'+amount,
    headers:{
      accept:"application/json"
    }
  })
})

Cypress.Commands.add('getTransactionsById',(transaction_id)=>{
  cy.request({
    method:'GET',
    url:'/services/bank/transactions/' + transaction_id,
    headers:{
      accept:"application/json"
    }
  }).then((response)=>{
    expect(response.status).to.eq(200)
    return(response.body)
  })
})

Cypress.Commands.add('getTransactionsByDate',(account_id, date)=>{
  cy.request({
    method:'GET',
    url:'/services/bank/accounts/'+account_id+'/transactions/onDate/'+date,
    headers:{
      accept:"application/json"
    }
  }).then(response =>{
    expect(response.status).to.eq(200)
    return(response.body)
  })
})

Cypress.Commands.add('getTransactionsByDateRange',(account_id, from_date, date)=>{
  cy.request({
    method:'GET',
    url:'/services/bank/accounts/'+account_id+'/transactions/fromDate/'+from_date+'/toDate/'+date,
    headers:{
      accept:"application/json"
    }
  }).then(response=>{
    expect(response.status).to.eq(200)
    return(response.body)
  })
})

Cypress.Commands.add('getTransactionsByAmount',(account_id, amount)=>{
  cy.request({
    method:'GET',
    url:'/services/bank/accounts/'+account_id+'/transactions/amount/'+amount,
    headers:{
      accept:"application/json"
    }
  }).then(response=>{
    expect(response.status).to.eq(200)
    return(response.body)
  })
})

Cypress.Commands.add('getAccountIdList',()=>{
  cy.getCustomerId().then(customer_id=>{
    cy.request({
      method:'GET',
      url:'/services/bank/customers/'+customer_id+'/accounts',
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      return(response.body)
    })
  })
})
