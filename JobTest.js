/// <reference types="Cypress" />
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
const { faker } = require('@faker-js/faker');
const email = faker.internet.email()
const name = faker.name.firstName()
const lastname = faker.name.lastName()
describe('Registration page', function(){

    beforeEach(() => {

        cy.visit('https://www.links.hr/hr/register')
    })

    it('Successful registration suit', function(){

        //Ensure registrirajte se page is shown
        cy.get('h1').should('have.text', ('Registrirajte se'))

        //Accept cookies 
        cy.get('#eu-cookie-ok').click()

        //Ensure error messages are shown below required fields
        cy.get('#register-button').click()
        cy.get('span[for="FirstName"]').should('have.text','Ime je potrebno')
        cy.get('span[for="LastName"]').should('have.text', 'Prezime je potrebno.')
        cy.get('span[for="Email"]').should('have.text','Elektronska pošta je potrebna')
        cy.get('span[for="Password"]').should('have.text','Lozinka je potrebna.')
        cy.get('span[for="ConfirmPassword"]').contains('Lozinka je potrebna.')

        //Fix first and last name fields
        cy.get('#FirstName').type(name)
        cy.get('#LastName').type(lastname)

        //Enter invalid data in email field
        cy.get('#Email').type('73944')
        cy.get('span[for="Email"]').should('have.text','Pogrešan e-mail')

        //Enter less than 6 characters in password field
        cy.get('#Password').type('33333')
        cy.get('span[for="Password"]').should('have.text','Lozinka treba imati najmanje 6 znakova.')

        //Ensure password and confirmation password doesn't match
        cy.get('#Password').clear().type('111111')
        cy.get('#ConfirmPassword').type('33333')
        cy.get('span[for="ConfirmPassword"]').should('have.text','Lozinka i potvrda lozinke se ne podudaraju.')

        // Entering valid data in confirm password and email fields
        cy.get('#ConfirmPassword').clear().type('111111')
        cy.get('#Email').clear().type(email)

        //Click on checkbox to open company form
        cy.get('#RegisterAsCompany').check()
        cy.get('#companyInfo').should('be.visible')
        cy.get('#CompanyOIB').type('1111111111')
        cy.get('#Company').type('Company name')

        //Ensure incorrect company Oib
        cy.get('.field-validation-error > span').contains('Neispravan OIB')

        //Enter valid data for company Oib and ulica field
        cy.get('#CompanyOIB').clear().type('21111111111')
        cy.get('#CompanyAddress').type('Cvijiceva')

         //Dynamic dropdown for city
         cy.get('.inputs.right > .ui-autocomplete-input').first().type('Beo') 
         cy.get('.ui-menu-item').each(($el, index, $list)=> {
            if($el.text()==="11111 Beograd, Serbia")
            {
                cy.wrap($el).click()
            }   
        })
        //Ensure correct city name is shown in field 
        cy.get('.inputs.right > .ui-autocomplete-input').first().should('have.value', 'Beograd')

        //Register and ensure you are redirected to correct page
        cy.get('#register-button').click()
        cy.get('.result').contains('Poslan vam je e-mail koji sadrži upute za aktivaciju članstva.')
        cy.get('.register-continue-button').click()
        cy.url().should('eq', 'https://www.links.hr/hr/')






        






        
    })

})

