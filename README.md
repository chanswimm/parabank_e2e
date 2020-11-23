# Parabank end-to-end test
### Requirement
Test cases are located in `cypress/integration folder`
Helper functions are located in `cypress/support/commands.js`
Database is initialized at each run (Configured in `cypress/support/index.js`)
Username and password are generated randomly

### Execution
1. Start cypress by running `./node_modules/.bin/cypress open`
2. Click `> Run 8 integration specs` on the top right corner

### Functionality covered:
* User Registration
* User Login
* Open New Account
* Accounts Overview
* Transfer Funds
* Bill Pay
* Find Transactions By Amount
* Logout
