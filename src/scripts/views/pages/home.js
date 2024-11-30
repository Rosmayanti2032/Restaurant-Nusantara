import SumberResto from '../../data/sumber-resto';
import { createRestaurantItemTemplate } from '../templates/template-resto';

const Home = {
  async render() {
    return `
      <div class="content">
        <h2 class="content__heading"> Journey To The Taste </h2>
        <div id="restaurants" class="restaurants">
          <div class="loader-container">
            <div class="loader"></div>
            <p class="loader-text">Loading restaurants...</p>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const restaurantsContainer = document.querySelector('#restaurants');

    try {
      const restaurants = await SumberResto.list();

      if (restaurants.length === 0) {
        restaurantsContainer.innerHTML = `
          <div class="restaurant-item__not__found">
            <i class="fa-solid fa-utensils"></i>
            <p>No restaurants found</p>
          </div>
        `;
        return;
      }

      restaurantsContainer.innerHTML = '';
      restaurants.forEach((restaurant) => {
        restaurantsContainer.innerHTML += createRestaurantItemTemplate(restaurant);
      });
    } catch (error) {
      console.error('Error:', error);
      restaurantsContainer.innerHTML = `
        <div class="error">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Failed to load restaurants</p>
          <p>Please check your connection and try again</p>
          <button class="error-button" onclick="location.reload()">
            <i class="fa-solid fa-rotate"></i> Retry
          </button>
        </div>
      `;
    }
  },
};

export default Home;
