const createRestaurantItemTemplate = (restaurant) => {
  function createStarRating(rating) {
    rating = Math.min(5, Math.max(0, rating));
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '★';
    stars += `<span class="empty-star">${'☆'.repeat(emptyStars)}</span>`;
    return stars;
  }

  const imgUrl = restaurant.pictureId
    ? `https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`
    : '/images/placeholder-restaurant.jpg';

  return `
    <div class="restoNusa-card">
      <img data-src="${imgUrl}" 
           alt="restoran ${restaurant.name}" 
           class="restoNusa-card-image lazyload">
      <div class="restoNusa-card-content">
        <h3 class="restoNusa-card-name">${restaurant.name}</h3>
        <div class="location">${restaurant.city || ''}</div>
        <div class="restoNusa-rating">
          <span class="stars">${createStarRating(restaurant.rating)}
          <small><b>${Number.isInteger(restaurant.rating) ? `${restaurant.rating}.0` : restaurant.rating}</b></small>
          </span>
        </div>
        <p class="restoNusa-description">
          ${restaurant.description ? `${restaurant.description.slice(0, 85)}...` : 'No description available'}
        </p>
        <div class="restoNusa-footer">
          <a href="#/detail/${restaurant.id}" class="order-button">Pesan Sekarang</a>
        </div>
      </div>
    </div>
  `;
};

const createRestaurantDetailTemplate = (restaurant) => {
  if (!restaurant) {
    return `
      <div class="error-container">
        <div class="error">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Restaurant data is currently unavailable</p>
          <p>You appear to be offline. Please check your connection and try again.</p>
          <button class="error-button" onclick="location.reload()">
            <i class="fa-solid fa-rotate"></i> Retry
          </button>
        </div>
      </div>
    `;
  }

  const imgUrl = restaurant.pictureId
    ? `https://restaurant-api.dicoding.dev/images/large/${restaurant.pictureId}`
    : '/images/placeholder-restaurant.jpg';

  const categoriesList = restaurant.categories
    ? restaurant.categories.map((category) => `<span class="category-tag">${category.name}</span>`).join('')
    : '<span class="category-tag">No categories available</span>';

  const foodMenu = restaurant.menus?.foods
    ? restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')
    : '<li>No food menu available</li>';

  const drinkMenu = restaurant.menus?.drinks
    ? restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')
    : '<li>No drinks menu available</li>';

  const customerReviews = restaurant.customerReviews
    ? restaurant.customerReviews
      .map(
        (review) => `
      <div class="review-card">
        <div class="review-header">
          <img 
            src="https://ui-avatars.com/api/?name=${review.name}&background=random" 
            alt="${review.name}" 
            class="review-avatar" 
            onerror="this.onerror=null;this.src='/images/default-avatar.jpg';">
          <div class="review-info">
            <p class="review-name">${review.name}</p>
            <p class="review-date">${review.date}</p>
          </div>
        </div>
        <p class="review-text">${review.review}</p>
      </div>`
      )
      .join('')
    : '<p>No reviews available</p>';

  return `
    <div class="restaurant-detail">
      <div class="detail-hero" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imgUrl}')">
        <div class="detail-hero-content">
          <h2 class="restaurant-name">${restaurant.name}</h2>
          <div class="restaurant-meta">
            <p class="restaurant-rating">
              <i class="fa-solid fa-star"></i> <span>${restaurant.rating}</span>
            </p>
            <p class="restaurant-location">
              <i class="fa-solid fa-location-dot"></i> ${restaurant.city}
            </p>
            <p class="restaurant-address">
              <i class="fa-solid fa-map"></i> ${restaurant.address}
            </p>
          </div>
        </div>
      </div>
      <div class="detail-content" id="mainContent" tabindex="-1">
        <section class="detail-section">
          <h3>Categories</h3>
          <div class="categories-list">${categoriesList}</div>
        </section>
        <section class="detail-section">
          <h3>Description</h3>
          <p class="restaurant-description">${restaurant.description || 'No description available'}</p>
        </section>
        <section class="detail-section">
          <h3>Menu</h3>
          <div class="menu-container">
            <div class="menu-column">
              <h4><i class="fa-solid fa-bowl-food"></i> Foods</h4>
              <ul class="menu-list">${foodMenu}</ul>
            </div>
            <div class="menu-column">
              <h4><i class="fa-solid fa-glass-water"></i> Drinks</h4>
              <ul class="menu-list">${drinkMenu}</ul>
            </div>
          </div>
        </section>
        <section class="detail-section">
          <div class="customer-review">
            <h3>Ulasan Pelanggan</h3>
            <form id="reviewForm" class="review-form">
              <div class="form-control">
                <label for="reviewName">Nama</label>
                <input type="text" id="reviewName" name="name" required placeholder="Isikan Nama">
              </div>
              <div class="form-control">
                <label for="reviewText">Komentar</label>
                <textarea id="reviewText" name="review" required placeholder="Isikan Komentar"></textarea>
              </div>
              <button type="submit" class="submit-review">Kirim</button>
            </form>
          </div>
          <div class="reviews-container">${customerReviews}</div>
        </section>
      </div>
    </div>
  `;
};

const createLikeButtonTemplate = () => `
  <button aria-label="like this restaurant" id="likeButton" class="like">
    <i class="fa-regular fa-heart" aria-hidden="true"></i>
  </button>
`;

const createLikedButtonTemplate = () => `
  <button aria-label="unlike this restaurant" id="likeButton" class="like">
    <i class="fa-solid fa-heart" aria-hidden="true"></i>
  </button>
`;

export {
  createRestaurantItemTemplate,
  createRestaurantDetailTemplate,
  createLikeButtonTemplate,
  createLikedButtonTemplate,
};
