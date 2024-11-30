const assert = require("assert");

Feature("Like Resto");

Before(({ I }) => {
  I.amOnPage("/#/favorite");
});

Scenario("like one restaurant", async ({ I }) => {
  I.see(
    "You don't have any favorite restaurants yet",
    ".restaurant-item__not__found"
  );

  I.amOnPage("/");
  I.seeElement(".restoNusa-card a");

  const firstRestaurant = locate(".restoNusa-card-name").first();
  const firstRestaurantTitle = await I.grabTextFrom(firstRestaurant);
  I.click(locate(".restoNusa-card a").first());

  I.seeElement("#likeButton");
  I.click("#likeButton");

  I.amOnPage("/#/favorite");
  I.seeElement(".restoNusa-card a");

  const likedRestaurantTitle = await I.grabTextFrom(".restoNusa-card-name");
  assert.strictEqual(firstRestaurantTitle, likedRestaurantTitle);
});
