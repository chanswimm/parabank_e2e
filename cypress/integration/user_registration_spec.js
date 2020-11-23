describe('The Register Page', () => {
  let username
  let password
  const first_name = 'John'
  const last_name = 'Doe'
  const address_street = '3567 Hanapepe Road'
  const address_city = 'Hanapepe'
  const address_state = 'Hawaii'
  const address_zip_code = '00000'
  const phone_number = '8083356469'
  const ssn = '545121111'

  beforeEach(()=>{
    cy.visit('/register.htm')
    cy.get('[name="customer\.firstName"]').focus().type(first_name)
    cy.get('[name="customer\.lastName"]').focus().type(last_name)
    cy.get('[name="customer\.address\.street"]').focus().type(address_street)
    cy.get('[name="customer\.address\.city"]').focus().type(address_city)
    cy.get('[name="customer\.address\.state"]').focus().type(address_state)
    cy.get('[name="customer\.address\.zipCode"]').focus().type(address_zip_code)
    cy.get('[name="customer\.phoneNumber"]').focus().type(phone_number)
    cy.get('[name="customer\.ssn"]').focus().type(ssn)
    cy.get('[name="customer\.username"]').focus().type('test_user_1')
    cy.get('[name="customer\.password"]').focus().type('Testing123')
    cy.get('[name="repeatedPassword"]').focus().type('Testing123')
  })

  it('Missing some required fields', () =>{
    cy.get('[name="customer\.address\.zipCode"]').focus().clear()
    cy.get('input[value="Register"]').click()
    cy.contains('Zip Code is required')
  })

  it('Account registered successfully', () =>{
    cy.getLoginInformation().then((user)=>{
      username=user[0]
      password=user[1]

    cy.get('[name="customer\.username"]').focus().clear().type(username)
    cy.get('[name="customer\.password"]').focus().clear().type(password)
    cy.get('[name="repeatedPassword"]').focus().clear().type(password)
    cy.get('[colspan="2"] > .button').click()
    cy.contains('Your account was created successfully. You are now logged in')
    cy.get('.title').should('contain',username)
    cy.request({
      method:'GET',
      url:'/services/bank/login/'+username+'/'+password,
      headers:{
        accept:"application/json"
      }
    }).then((response)=>{
      cy.request({
        method:'GET',
        url:'/services/bank/customers/'+response.body.id,
        headers:{
          accept:"application/json"
        }
      }).then((customer_info)=>{
        expect(customer_info.body.firstName).to.eq(first_name)
        expect(customer_info.body.lastName).to.eq(last_name)
        expect(customer_info.body.address.street).to.eq(address_street)
        expect(customer_info.body.address.city).to.eq(address_city)
        expect(customer_info.body.address.state).to.eq(address_state)
        expect(customer_info.body.address.zipCode).to.eq(address_zip_code)
        expect(customer_info.body.phoneNumber).to.eq(phone_number)
        expect(customer_info.body.ssn).to.eq(ssn)
      })
    })
  })
  })

  it('Username taken', () => {
    cy.getLoginInformation().then((user)=>{
      cy.get('[name="customer\.username"]').focus().clear().type(user[0])
      cy.get('[colspan="2"] > .button').click()
      cy.contains('This username already exists.')
    })
  })
})
