describe('Bill payment service', () =>{
  let from_acc
  const payee_name = 'payee 1'
  const amount = 12
  beforeEach(()=>{
    cy.login()
    cy.visit('/billpay.htm')
    cy.get('[name="payee\.name"]').focus().type(payee_name)
    cy.get('[name="payee\.address.street"]').focus().type('street')
    cy.get('[name="payee\.address.city"]').focus().type('city')
    cy.get('[name="payee\.address.state"]').focus().type('state')
    cy.get('[name="payee\.address.zipCode"]').focus().type('00000')
    cy.get('[name="payee\.phoneNumber"]').focus().type('5450009999')
    cy.get('[name="payee\.accountNumber"]').focus().type('12345')
    cy.get('[name="verifyAccount"]').focus().type('12345')
    cy.get('[name="amount"]').focus().type(amount)
    cy.getSingleAccount().then((account_id)=>{
      from_acc = JSON.stringify(account_id)
      cy.get('[name="fromAccountId"]').select(from_acc)
    })
  })

  it('Missing Payee infomration', () =>{
    cy.get('[name="payee\.name"]').focus().clear()
    cy.get('input[type="submit"]').click()
    cy.contains('Payee name is required')
  })

  it('Mismatch between Payee account number', ()=> {
    cy.get('[name="verifyAccount"]').focus().clear().type('00000')
    cy.get('input[type="submit"]').click()
    cy.contains('The account numbers do not match')
  })

  it('Missing amount', () =>{
    cy.get('[name="amount"]').focus().clear()
    cy.get('input[type="submit"]').click()
    cy.contains('The amount cannot be empty')
  })

  it('Invalid type for account number and amount', () =>{
    cy.get('[name="payee\.accountNumber"]').focus().type('zzzz')
    cy.get('[name="verifyAccount"]').focus().type('zzzz')
    cy.get('[name="amount"]').focus().clear().type('abc')
    cy.get('input[type="submit"]').click()
    cy.contains('Please enter a valid amount')
    cy.contains('Please enter a valid number')
  })

  it('Bill payment successful', () =>{
    cy.getBalance(from_acc).then((prev_balance)=>{
      cy.get('input[type="submit"]').click()
      cy.contains('Bill Payment Complete')

      cy.getTransactions(from_acc).then((body)=>{
        expect(body.[body.length-1].description).to.eq('Bill Payment to ' + payee_name)
      })

      var new_balance = prev_balance-amount
      cy.getBalance(from_acc).then((balance)=>{
        expect(balance).to.eq(new_balance)
      })
    })
  })

  // This should fail since account balance < transfer amount
  it('Payment from account with insufficient funds', () =>{
    const big_amount = 1000
    cy.get('[name="amount"]').focus().clear().type(big_amount)
    cy.getBalance(from_acc).then((prev_balance)=>{
      if(prev_balance < big_amount){
        cy.log('Account does not have sufficient funds - this should fail')
      }
      cy.get('input[type="submit"]').click()
      cy.contains('Bill Payment Complete')

      cy.getTransactions(from_acc).then((body)=>{
        expect(body.[body.length-1].description).to.eq('Bill Payment to ' + payee_name)
      })

      var new_balance = prev_balance-big_amount
      cy.getBalance(from_acc).then((balance)=>{
        expect(balance).to.eq(new_balance)
      })
    })
  })
})
