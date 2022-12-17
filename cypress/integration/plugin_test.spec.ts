describe('My First Test', () => {
  it('visits JBrowse', () => {
    // You can put JBrowse 2 into any session you want this way at the beginning
    // of your test!
    cy.fixture('refget_session.json').then(sessionData => {
      cy.writeFile(
        '.jbrowse/refget_session.json',
        JSON.stringify(sessionData, null, 2),
      )
      cy.visit('/?config=refget_session.json')

      // The plugin successfully loads
      cy.contains('Hello refget plugin')
    })
  })
})
