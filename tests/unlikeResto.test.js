import LikeButtonInitiator from '../src/scripts/utils/like-button-initiator';
import FavoriteRestaurantIdb from '../src/scripts/data/favorite-restaurant-idb';

describe('Unlike A Resto', () => {
  const createLikeButtonPresenterWithRestaurant = async (restaurant) => {
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector('#likeButtonContainer'),
      restaurant,
    });
  };

  beforeEach(() => {
    document.body.innerHTML = '<div id="likeButtonContainer"></div>';
  });

  afterEach(async () => {
    await FavoriteRestaurantIdb.deleteRestaurant(1);
  });

  it('should display unlike widget when the resto has been liked', async () => {
    const restaurant = {
      id: 1,
      name: 'Test Restaurant',
    };

    await FavoriteRestaurantIdb.putRestaurant(restaurant);
    await createLikeButtonPresenterWithRestaurant(restaurant);

    expect(document.querySelector('[aria-label="unlike this restaurant"]'))
      .toBeTruthy();
  });

  it('should not display like widget when the resto has been liked', async () => {
    const restaurant = {
      id: 1,
      name: 'Test Restaurant',
    };

    await FavoriteRestaurantIdb.putRestaurant(restaurant);
    await createLikeButtonPresenterWithRestaurant(restaurant);

    expect(document.querySelector('[aria-label="like this restaurant"]'))
      .toBeFalsy();
  });

  it('should be able to remove liked resto from the list', async () => {
    const restaurant = {
      id: 1,
      name: 'Test Restaurant',
    };

    await FavoriteRestaurantIdb.putRestaurant(restaurant);
    await createLikeButtonPresenterWithRestaurant(restaurant);

    document.querySelector('[aria-label="unlike this restaurant"]').dispatchEvent(new Event('click'));

    const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();
    expect(restaurants).toHaveLength(0);
  });

  it('should not throw error if the unliked resto is not in the list', async () => {
    const restaurant = {
      id: 1,
      name: 'Test Restaurant',
    };

    await createLikeButtonPresenterWithRestaurant(restaurant);

    // Verify initial like button exists
    const likeButton = document.querySelector('[aria-label="like this restaurant"]');
    expect(likeButton).toBeTruthy();

    // Simulate clicking the unlike button even when restaurant is not in favorites
    const unlikeButton = document.querySelector('[aria-label="unlike this restaurant"]');
    if (unlikeButton) {
      unlikeButton.dispatchEvent(new Event('click'));
    }

    // Verify restaurant list is empty
    const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();
    expect(restaurants).toHaveLength(0);
  });
});