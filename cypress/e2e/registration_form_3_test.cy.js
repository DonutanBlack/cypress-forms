beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
describe('Section 1: Visual tests for registration form 3', () => {
     it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')

        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })
    it('Country dropdown is correct', () => {
        cy.get('select#country').select(1).screenshot('Country drop-down')
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').eq(0).should('have.text','')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')
        cy.get('#country').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['', 'object:3', 'object:4', 'object:5'])
        })
    })
    it('City list are correct', () => {
        cy.get('select#country').select(1)
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city').find('option').eq(0).should('have.text','')
        cy.get('#city').find('option').eq(1).should('have.text', 'Malaga').should('have.value', 'string:Malaga')
        cy.get('#city').find('option').eq(2).should('have.text', 'Madrid').should('have.value', 'string:Madrid')
        cy.get('#city').find('option').eq(3).should('have.text', 'Valencia').should('have.value', 'string:Valencia')
        cy.get('#city').find('option').eq(4).should('have.text', 'Corralejo').should('have.value', 'string:Corralejo')
        cy.get('select#city').select(1)
        cy.get('select#city option:selected').should('have.text', 'Malaga')
        cy.get('select#country').select(2)
        cy.get('select#city').should('not.be.selected')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').eq(0).should('have.text','')
        cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn').should('have.value', 'string:Tallinn')
        cy.get('#city').find('option').eq(2).should('have.text', 'Haapsalu').should('have.value', 'string:Haapsalu')
        cy.get('#city').find('option').eq(3).should('have.text', 'Tartu').should('have.value', 'string:Tartu')
        cy.get('select#city').select(2)
        cy.get('select#city option:selected').should('have.text', 'Haapsalu')
        cy.get('select#country').select(3)
        cy.get('select#city').should('not.be.selected')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').eq(0).should('have.text','')
        cy.get('#city').find('option').eq(1).should('have.text', 'Vienna').should('have.value', 'string:Vienna')
        cy.get('#city').find('option').eq(2).should('have.text', 'Salzburg').should('have.value', 'string:Salzburg')
        cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck').should('have.value', 'string:Innsbruck')
        cy.get('select#city').select(3)
        cy.get('select#city option:selected').should('have.text', 'Innsbruck')
        })
    it('Check the checkboxes, their content and links', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)
        cy.get('.w3-container').children().eq(19).within(() => {
            //cy.get('input[type="checkbox"]').next().eq(0).should('have.text','Accept our privacy policy')
            cy.get('button').should('have.text','Accept our cookie policy')
            cy.get('a').should('have.attr', 'href', 'cookiePolicy.html').click()
            cy.url().should('contain', '/cookiePolicy.html')
            cy.go('back')
            cy.log('Back again in registration form 3')
        })    
        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
        })
    it('Email input should have correct format', () => {
        cy.get('[name="email"]').type('invalid')
        cy.get('h1').contains('Registration page').click()
        cy.get('#emailAlert').should('be.visible').should('contain', 'Invalid email address.')
        cy.get('input[type="submit"]').should('not.be.enabled');
    })        
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */
describe('Section 2: Functional tests for registration form 3', () => {
    it('User can submit form with all fields filled in', ()=>{
        inputValidData('VBtest')
        cy.get('input[type="submit"]').should('be.enabled');
        cy.get('input[type="submit"]').click()
        cy.get('h1').should('be.visible')
    })

    it('User can submit form with only mandatory fields filled in', ()=>{
        inputMandatoryData('VBtest')
        cy.get('input[type="submit"]').should('be.enabled');
        cy.get('input[type="submit"]').click()
        cy.get('h1').should('be.visible').should('contain', 'Submission received')
    })

    it('User cannot submit data when mandatory fields are absent', ()=>{
        inputValidData('VBtest')
        cy.get('input#name').clear()
        cy.get('[name="email"]').clear()
        cy.get('select#country').select(0)
        cy.get('input[type="checkbox"]').eq(0).uncheck()
        cy.get('input[type="submit"]').should('be.disabled')
    })

    it('User can submit file', ()=>{    
        cy.get('input[type=file]').selectFile({
            contents: Cypress.Buffer.from('file contents'),
            fileName: 'file.txt',
            lastModified: Date.now(),
        })
        cy.get('button[type="submit"]').click()
        cy.get('h1').should('be.visible').should('contain', 'Submission received')
    })
})

function inputValidData(name) {
    cy.log('Username will be filled')
    cy.get('input#name').type(name)
    cy.get('[name="email"]').type('VBrg3@test.com')
    cy.get('select#country').select(2)
    cy.get('select#city').select(2)
    cy.get('.w3-container').children().eq(12).within(() => {
        cy.get('input[type="date"]').type('2024-10-01')
    })    
    cy.get('input[type="radio"]').eq(1).check()
    cy.get('input#birthday').type('1989-10-27')
    cy.get('input[type="checkbox"]').eq(0).check()
    cy.get('input[type="checkbox"]').eq(1).check()
    cy.get('h1').contains('Registration page').click()
}
function inputMandatoryData(name) {
    cy.log('Username will be filled')
    cy.get('input#name').type(name)
    cy.get('[name="email"]').type('VBrg3@test.com')
    cy.get('select#country').select(2)
    cy.get('select#city').select(2)
    cy.get('input[type="checkbox"]').eq(0).check()
    cy.get('h1').contains('Registration page').click()
}