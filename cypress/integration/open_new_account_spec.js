describe('Open new account', () =>{
  beforeEach(()=>{
    cy.login({username:'q', password:'q'})
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

})
