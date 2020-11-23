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
  const amount = 100
  beforeEach(() =>{
    cy.login()
    cy.visit('/findtrans.htm')
    cy.getSingleAccount().then((account)=>{
      account_id = account
      cy.get('#accountId').select(JSON.stringify(account_id))
    })
    cy.getTransactionId().then((transaction)=>{
      transaction_id = transaction
    })
  })

  it('Missing or invalid information', () =>{
    cy.get(':nth-child(5) > .button').click()
  })

  it('Find Transactions by ID', () =>{
    cy.get('input[ng-model="criteria\.transactionId"]').type(JSON.stringify(transaction_id))
    cy.get(':nth-child(5) > .button').click()
    cy.get(':nth-child(2) > .ng-binding').then(($transaction)=>{
      const transaction_description = $transaction.text()
      cy.request({
        method:'GET',
        url:'/services/bank/transactions/' + transaction_id,
        headers:{
          accept:"application/json"
        }
      }).then((response)=>{
        expect(response.status).to.eq(200)
        expect(response.body.description).to.eq(transaction_description)
        expect(response.body.accountId).to.eq(account_id)
        expect(response.body.id).to.eq(transaction_id)
      })
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
      expect(response.status).to.eq(200)
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
      expect(response.status).to.eq(200)
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
      expect(response.status).to.eq(200)
      for(var i = 0; i < response.body.length; i++){
        expect(response.body.[i].amount).to.eq(amount)
        expect(response.body.[i].accountId).to.eq(account_id)
        cy.contains(response.body.[i].description)
      }
    })
  })
})
