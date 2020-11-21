var username='beans_test'
var password='123'

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
