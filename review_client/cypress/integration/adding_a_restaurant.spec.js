describe('adding a restaurant', () => {
  it('displays the restaurant in the list', () => {
    const restaurantName = 'Sushi Place';

    cy.visit('http://localhost:1234');

    cy.get('button[data-test="addNewRestaurant"]')
      .click();

    cy.get('input[data-test="newRestaurantName"]')
      .type('Sushi Place');

    cy.get('[data-test="saveNewRestaurantButton"]')
      .click();

    cy.contains(restaurantName);
  });
});
