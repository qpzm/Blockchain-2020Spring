describe('Smoke Test', () => {
  it('Makes sure the welcom message comes up!', () => {
    cy.visit('http://localhost:1234')
      .contains('Hello, world!')
  })
})
