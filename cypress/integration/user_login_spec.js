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
      cy.getCustomerDetails().then((customer_info)=>{
        expect(customer_info.id).to.equal(response.body.id)
        expect(customer_info.firstName).to.eq(response.body.firstName)
        expect(customer_info.lastName).to.eq(response.body.lastName)
        expect(customer_info.address.street).to.eq(response.body.address.street)
        expect(customer_info.address.city).to.eq(response.body.address.city)
        expect(customer_info.address.state).to.eq(response.body.address.state)
        expect(customer_info.address.zipCode).to.eq(response.body.address.zipCode)
        expect(customer_info.phoneNumber).to.eq(response.body.phoneNumber)
        expect(customer_info.ssn).to.eq(response.body.ssn)
      })
    })
  })

})
