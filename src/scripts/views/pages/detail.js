import UrlParser from '../../routes/url-parser';
import SumberResto from '../../data/sumber-resto';
import { createRestaurantDetailTemplate } from '../templates/template-resto';
import LikeButtonInitiator from '../../utils/like-button-initiator';

const Detail = {
  async render() {
    return `
      <div class='restaurant-detail' id='restaurant'>
        <div class='loader-container'>
          <div class='loader'></div>
          <p class='loader-text'>Loading restaurant details...</p>
        </div>
      </div>
      <div id='likeButtonContainer'></div>
    `;
  },

  async afterRender() {
    const skipLinkElem = document.querySelector('.skip-link');
    if (skipLinkElem) {
      skipLinkElem.addEventListener('click', (event) => {
        event.preventDefault();
        const mainContent = document.querySelector('#mainContent');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    window.scrollTo({ top: 0 });
    try {
      const restaurantContainer = document.querySelector('#restaurant');
      const likeButtonContainer = document.querySelector('#likeButtonContainer');
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      const restaurant = await SumberResto.detail(url.id);

      if (restaurant) {
        restaurantContainer.innerHTML = createRestaurantDetailTemplate(restaurant);

        const reviewForm = document.querySelector('#reviewForm');
        if (reviewForm) {
          reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const reviewData = {
              id: url.id,
              name: document.querySelector('#reviewName').value,
              review: document.querySelector('#reviewText').value,
            };

            try {
              const response = await SumberResto.postReview(reviewData);
              const reviewsContainer = document.querySelector('.reviews-container');
              reviewsContainer.innerHTML = response.customerReviews
                .map(
                  (review) => `
                <div class='review-card'>
                  <div class='review-header'>
                    <img 
                      src='https://ui-avatars.com/api/?name=${review.name}&background=random' 
                      alt='${review.name}'
                      class='review-avatar'
                    >
                    <div class='review-info'>
                      <p class='review-name'>${review.name}</p>
                      <p class='review-date'>${review.date}</p>
                    </div>
                  </div>
                  <p class='review-text'>${review.review}</p>
                </div>
              `
                )
                .join('');

              reviewForm.reset();
            } catch (error) {
              console.error('Review Error:', error);
              alert('Failed to submit review. Please try again.');
            }
          });
        }

        await LikeButtonInitiator.init({
          likeButtonContainer,
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            description: restaurant.description,
            pictureId: restaurant.pictureId,
            rating: restaurant.rating,
            city: restaurant.city,
          },
        });
      } else {
        throw new Error('Restaurant not found');
      }
    } catch (error) {
      console.error('Error:', error);
      const restaurantContainer = document.querySelector('#restaurant');
      restaurantContainer.innerHTML = `
        <div class='error'>
          <i class='fa-solid fa-triangle-exclamation'></i>
          <p>Failed to load restaurant detail</p>
          <p>${error.message || 'Please check your connection and try again'}</p>
          <button class='error-button' onclick='location.reload()'>
            <i class='fa-solid fa-rotate'></i> Retry
          </button>
        </div>
      `;
    }
  },
};

export default Detail;
