describe('Transfer Funds', () =>{
  let from_acc
  let to_acc
  const amount = 8
  beforeEach(()=>{
    cy.login()
    cy.createAccount('CHECKING')
    cy.visit('/transfer.htm')
    cy.getTwoAccounts().then((accounts)=>{
      to_acc = JSON.stringify(accounts[0])
      from_acc = JSON.stringify(accounts[1])
    })
  })

  it('Error for Missing Transfer amount', () =>{
    cy.get('[type="submit"]').click()
    cy.contains('The amount cannot be empty.')
    const a=''
    cy.request({
      method:'POST',
      url:'/services/bank/transfer?fromAccountId='+from_acc+'&toAccountId='+to_acc+'&amount'+a,
      failOnStatusCode:false,
      headers:{
        accept:"application/json"
      }
    }).then((response)=>{
      expect(response.status).to.eq(500)
    })
  })

  it('Error for Invalid type for amount', () =>{
    cy.get('#amount').type('abc')
    cy.get('[type="submit"]').click()
    cy.contains('Please enter a valid amount')

    cy.request({
      method:'POST',
      url:'/services/bank/transfer?fromAccountId='+from_acc+'&toAccountId='+to_acc+'&amount=abc',
      failOnStatusCode:false,
      headers:{
        accept:"application/json"
      }
    }).then((response)=>{
      expect(response.status).to.eq(404)
    })
  })

  it('Transfer Funds from accountA to accountB', ()=>{
    cy.get('#amount').type(amount)
    cy.get('#fromAccountId').select(from_acc)
    cy.get('#toAccountId').select(to_acc)
    cy.getBalance(from_acc).then((from_acc_prev_balance)=>{
      cy.getBalance(to_acc).then((to_acc_prev_balance)=>{
        cy.get('[type="submit"]').click()
        cy.contains('Transfer Complete!')
        cy.getBalance(from_acc).then((from_acc_new_balance)=>{
          expect(from_acc_new_balance).to.eq(from_acc_prev_balance - amount)
        })
        cy.getBalance(to_acc).then((to_acc_new_balance)=>{
          expect(to_acc_new_balance).to.eq(to_acc_prev_balance + amount)
        })
      })
    })
    cy.getTransactions(to_acc).then((body)=>{
      expect(body.[body.length-1].description).to.eq('Funds Transfer Received')
    })
    cy.getTransactions(from_acc).then((body)=>{
      expect(body.[body.length-1].description).to.eq('Funds Transfer Sent')
    })
  })

  //This should fail since from_acc has balance < transfer amount
  it('Transfer Funds from Account that does not have sufficient funds', () =>{
    const big_amount = 4000
    cy.get('#amount').type(big_amount)
    cy.get('#fromAccountId').select(from_acc)
    cy.get('#toAccountId').select(to_acc)
    cy.getBalance(from_acc).then((from_acc_prev_balance)=>{
      if(from_acc_prev_balance < big_amount){
        cy.log('Account does not have sufficient funds - this should fail')
      }
      cy.getBalance(to_acc).then((to_acc_prev_balance)=>{
        cy.get('[type="submit"]').click()
        cy.contains('Transfer Complete!')
        cy.getBalance(from_acc).then((from_acc_new_balance)=>{
          expect(from_acc_new_balance).to.eq(from_acc_prev_balance - big_amount)
        })
        cy.getBalance(to_acc).then((to_acc_new_balance)=>{
          expect(to_acc_new_balance).to.eq(to_acc_prev_balance + big_amount)
        })
      })
    })
  })
})
