// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
//const enableTracking = require('tracked-tests-cypress')
const { v4: uuidv4 } = require('uuid');

    beforeEach(() => {
        const uniqueUUID = uuidv4();
        const titleParts = Cypress.currentTest.titlePath;
        cy.intercept(
          { url: '*', middleware: true },
          (req) => {
            if (titleParts && titleParts.length >= 2 && titleParts[1]!='"after all" hook') {
              req.headers['trackedtest.suite'] = titleParts[0];
              req.headers['trackedtest.name'] = titleParts[1];
              req.headers['trackedtest.invocation_id'] = uniqueUUID;
              req.headers['trackedtest.type'] = 'cypress';
//              if(!disableLogging){
                console.log("Tracked Test metadata attached" + " suite: " + req.headers['trackedtest.suite'] + " name: " + req.headers['trackedtest.name'] + " invocation_id: " + uniqueUUID);
//              }
            }
          }
        ).as("modifiedRequest");

    });