describe('User Login', () =>{
  let username
  let password
  before(()=>{
    cy.getLoginInformation().then((user)=>{
      username = user[0]
      password = user[1]
    })
  })

  it('Login with invalid credentials', () =>{
    cy.visit('/index.htm')
    cy.request({
      method:'GET',
      url:'/services/bank/login/invalid/invalid',
      failOnStatusCode:false,
      headers:{
        accept:"application/json"
      }
    }).then((response)=>{
      expect(response.body).to.eq('Invalid username and/or password')
    })

    cy.get('input[name=username]').type('invalid')
    cy.get('input[name=password]').type('invalid')
    cy.get('[type="submit"]').click()
    cy.contains('The username and password could not be verified.')
  })

  it('Login with missing username or password field', ()=>{
    cy.visit('/index.htm')
    cy.get('input[name=password]').type(password)
    cy.get('[type="submit"]').click()
    cy.contains('Please enter a username and password.')
  })

  it('Login as test user', () =>{
    cy.visit('/index.htm')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(password)
    cy.get('[type="submit"]').click()
    cy.url().should('include','/overview.htm')
    cy.request({
      method:'GET',
      url:'/services/bank/login/'+username+'/'+password,
      headers:{
        accept:"application/json"
      }
    }).then((response)=>{
      expect(response.status).to.eq(200)
      cy.request({
        method:'GET',
        url:'/services/bank/customers/' + response.body.id,
        headers:{
          accept:"application/json"
        }
      }).then((customer_info)=>{
        expect(customer_info.body.firstName).to.eq(response.body.firstName)
        expect(customer_info.body.lastName).to.eq(response.body.lastName)
        expect(customer_info.body.ssn).to.eq(response.body.ssn)
      })
    })
  })

})
