const assert = require("assert");

Feature("Adding Review");

Before(({ I }) => {
  I.amOnPage("/");
});

Scenario("add a review", async ({ I }) => {
  I.seeElement(".restoNusa-card a");
  const firstRestaurant = locate(".restoNusa-card-name").first();
  const firstRestaurantTitle = await I.grabTextFrom(firstRestaurant);
  I.click(locate(".restoNusa-card a").first());

  I.seeElement(".restaurant-detail");
  const detailRestaurantTitle = await I.grabTextFrom(".restaurant-name");
  assert.strictEqual(firstRestaurantTitle, detailRestaurantTitle);

  I.seeElement("#reviewForm");
  I.seeElement("#reviewName");
  I.seeElement("#reviewText");
  I.seeElement(".submit-review");

  const initialReviewCount = await I.grabNumberOfVisibleElements(
    ".review-card"
  );

  const reviewerName = "E2E Tester";
  const reviewText = "Testing review via E2E Testing";
  I.fillField("#reviewName", reviewerName);
  I.fillField("#reviewText", reviewText);
  I.click(".submit-review");

  I.wait(2);

  const newReviewCount = await I.grabNumberOfVisibleElements(".review-card");
  assert.strictEqual(newReviewCount, initialReviewCount + 1);

  const reviewNames = await I.grabTextFromAll(".review-name");
  const reviewTexts = await I.grabTextFromAll(".review-text");

  const lastReviewName = reviewNames[reviewNames.length - 1];
  const lastReviewText = reviewTexts[reviewTexts.length - 1];

  assert.strictEqual(lastReviewName, reviewerName);
  assert.strictEqual(lastReviewText, reviewText);

  const nameFieldValue = await I.grabValueFrom("#reviewName");
  const reviewFieldValue = await I.grabValueFrom("#reviewText");
  assert.strictEqual(nameFieldValue, "");
  assert.strictEqual(reviewFieldValue, "");
});

Scenario("try to submit empty review", async ({ I }) => {
  I.seeElement(".restoNusa-card a");
  I.click(locate(".restoNusa-card a").first());

  I.seeElement("#reviewForm");
  I.click(".submit-review");

  I.seeElement("form:invalid");
});
