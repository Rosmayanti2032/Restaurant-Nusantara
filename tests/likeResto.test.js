import LikeButtonInitiator from '../src/scripts/utils/like-button-initiator';
import FavoriteRestaurantIdb from '../src/scripts/data/favorite-restaurant-idb';

const createLikeButtonPresenterWithRestaurant = async (restaurant) => {
  document.body.innerHTML = `
    <div id="likeButtonContainer"></div>
    <button id="likeButton" aria-label="like this resto"></button>
  `;

  await LikeButtonInitiator.init({
    likeButtonContainer: document.querySelector('#likeButtonContainer'),
    restaurant,
  });
};

describe('Like A Resto', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="likeButtonContainer"></div>';
  });

  afterEach(async () => {
    await FavoriteRestaurantIdb.deleteRestaurant(1);
  });

  it('should show the like button when the resto has not been liked before', async () => {
    await createLikeButtonPresenterWithRestaurant({ id: 1 });

    // Pastikan tombol "Like" ditampilkan
    expect(document.querySelector('[aria-label="like this resto"]')).toBeTruthy();
  });

  it('should not show the unlike button when the resto has not been liked before', async () => {
    await createLikeButtonPresenterWithRestaurant({ id: 1 });

    // Pastikan tombol "Unlike" tidak ditampilkan
    expect(document.querySelector('[aria-label="unlike this resto"]')).toBeFalsy();
  });

  it('should be able to like the resto', async () => {
    await createLikeButtonPresenterWithRestaurant({ id: 1 });

    document.querySelector('#likeButton').dispatchEvent(new Event('click'));

    const restaurant = await FavoriteRestaurantIdb.getRestaurant(1);

    // Pastikan resto telah disimpan dengan benar
    expect(restaurant).toEqual({ id: 1 });
  });

  it('should not add a resto again when it is already liked', async () => {
    await createLikeButtonPresenterWithRestaurant({ id: 1 });

    // Simpan resto ke database
    await FavoriteRestaurantIdb.putRestaurant({ id: 1 });

    // Klik tombol "Like" lagi
    document.querySelector('#likeButton').dispatchEvent(new Event('click'));

    const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();

    // Pastikan resto hanya ada satu
    expect(restaurants).toHaveLength(1);
  });

  it('should not add a resto when it has no id', async () => {
    await createLikeButtonPresenterWithRestaurant({});

    document.querySelector('#likeButton').dispatchEvent(new Event('click'));

    const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();

    // Pastikan resto tidak ditambahkan
    expect(restaurants).toHaveLength(0);
  });
});