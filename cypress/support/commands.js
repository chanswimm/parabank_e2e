Cypress.Commands.add('login', (user) =>{
  cy.visit('/index.htm')
  cy.get('input[name=username]').type(user.username)
  cy.get('input[name=password]').type(user.password)
  cy.get(':nth-child(5) > .button').click()
})

// Cypress.Commands.add('login',(user)=>{
//   cy.request({
//     url: '/login.htm',
//     method:'POST',
//     body:{
//       username: user.username,
//       password: user.password,
//     }
//   })
// })
