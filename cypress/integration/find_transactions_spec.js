describe('Find Transactions By Amount', () => {
  let account_id
  let transaction_id
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, '0')
  var mm = String(date.getMonth() + 1).padStart(2, '0')
  var yyyy = date.getFullYear()
  date = mm + '-' + dd + '-' + yyyy
  const from_date = mm + '-' + (dd-5) + '-' + yyyy
  console.log(from_date)
  const amount = '100'
  beforeEach(() =>{
    cy.login()
    cy.visit('/findtrans.htm')
    cy.getSingleAccount().then((account)=>{
      account_id = JSON.stringify(account)
      cy.get('#accountId').select(account_id)
    })
    cy.getTransactionId().then((transaction)=>{
      transaction_id = JSON.stringify(transaction)
    })

  })

  it('Missing or invalid information', () =>{
    cy.get(':nth-child(5) > .button').click()
  })

  it('Find Transactions by ID', () =>{
    cy.get('input[ng-model="criteria\.transactionId"]').type(transaction_id)
    cy.get(':nth-child(5) > .button').click()
    cy.get(':nth-child(2) > .ng-binding').then(($transaction)=>{
      const transaction_description = $transaction.text()
      cy.request('GET', '/services/bank/transactions/' + transaction_id).its('body').should('include', transaction_description)
    })
  })

  it('Find Transactions by Date', ()=>{
    cy.get('input[ng-model="criteria\.onDate"]').type(date)
    cy.get(':nth-child(9) > .button').click()

    cy.request({
      method:'GET',
      url:'/services/bank/accounts/'+account_id+'/transactions/onDate/'+date,
      headers:{
        accept:"application/json"
      }
    }).then(response =>{
      for(var i = 0; i < response.body.length; i++){
        cy.contains(response.body.[i].description)
      }
    })
  })

  it('Find Transactions by Date Range', () =>{
    cy.get('input[ng-model="criteria\.fromDate"]').type(from_date)
    cy.get('input[ng-model="criteria\.toDate"]').type(date)
    cy.get(':nth-child(13) > .button').click()
    cy.request({
      method:'GET',
      url:'/services/bank/accounts/'+account_id+'/transactions/fromDate/'+from_date+'/toDate/'+date,
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      for(var i = 0; i < response.body.length; i++){
        cy.contains(response.body.[i].description)
      }
    })
  })

  it('Find Transactions by Amount', () =>{
    cy.get('input[ng-model="criteria\.amount"]').type(amount)
    cy.get(':nth-child(17) > .button').click()
    cy.request({
      method:'GET',
      url:'/services/bank/accounts/'+account_id+'/transactions/amount/'+amount,
      headers:{
        accept:"application/json"
      }
    }).then(response=>{
      for(var i = 0; i < response.body.length; i++){
        cy.contains(response.body.[i].description)
      }
    })
  })
})
