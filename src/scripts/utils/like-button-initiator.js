import FavoriteRestaurantIdb from '../data/favorite-restaurant-idb';
import { createLikeButtonTemplate, createLikedButtonTemplate } from '../views/templates/template-resto';

const LikeButtonInitiator = {
  async init({ likeButtonContainer, restaurant }) {
    if (!restaurant) {
      throw new Error('restaurant object is required');
    }

    this._likeButtonContainer = likeButtonContainer;
    this._restaurant = restaurant;

    await this._renderButton();
  },

  async _renderButton() {
    try {
      const { id } = this._restaurant || {};

      if (!id) {
        this._renderLike();
        return;
      }

      if (await this._isRestaurantExist(id)) {
        this._renderLiked();
      } else {
        this._renderLike();
      }
    } catch (error) {
      console.error('Failed to render like button:', error);
      this._renderLike();
    }
  },

  async _isRestaurantExist(id) {
    try {
      const restaurant = await FavoriteRestaurantIdb.getRestaurant(id);
      return Boolean(restaurant);
    } catch {
      return false;
    }
  },

  _renderLike() {
    this._likeButtonContainer.innerHTML = createLikeButtonTemplate();

    const likeButton = document.querySelector('#likeButton');
    likeButton?.addEventListener('click', async () => {
      if (!this._restaurant?.id) {
        return;
      }

      try {
        await FavoriteRestaurantIdb.putRestaurant(this._restaurant);
        this._renderButton();
      } catch (error) {
        console.error('Failed to like restaurant:', error);
      }
    });
  },

  _renderLiked() {
    this._likeButtonContainer.innerHTML = createLikedButtonTemplate();

    const likeButton = document.querySelector('#likeButton');
    likeButton?.addEventListener('click', async () => {
      if (!this._restaurant?.id) {
        return;
      }

      try {
        await FavoriteRestaurantIdb.deleteRestaurant(this._restaurant.id);
        this._renderButton();
      } catch (error) {
        console.error('Failed to unlike restaurant:', error);
      }
    });
  },
};

export default LikeButtonInitiator;