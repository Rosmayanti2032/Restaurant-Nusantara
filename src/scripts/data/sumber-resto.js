import API_ENDPOINT from '../globals/api-endpoint';
import CONFIG from '../globals/config';

class SumberResto {
  static async list() {
    try {
      const cache = await caches.open(CONFIG.CACHE_NAME);
      const cachedResponse = await cache.match(API_ENDPOINT.LIST);

      if (cachedResponse) {
        const responseJson = await cachedResponse.json();
        return responseJson.restaurants;
      }

      const response = await fetch(API_ENDPOINT.LIST);
      const responseJson = await response.json();

      if (responseJson.restaurants) {
        cache.put(
          API_ENDPOINT.LIST,
          new Response(JSON.stringify(responseJson))
        );
      }

      return responseJson.restaurants;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  static async detail(id) {
    const endpoint = API_ENDPOINT.DETAIL(id);
    console.log(endpoint);

    try {
      const cache = await caches.open(CONFIG.CACHE_NAME);
      const cachedResponse = await cache.match(endpoint);

      if (cachedResponse) {
        const responseJson = await cachedResponse.json();
        return responseJson.restaurant;
      }
      const response = await fetch(endpoint);
      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      if (responseJson.restaurant) {
        cache.put(endpoint, new Response(JSON.stringify(responseJson)));
      }

      return responseJson.restaurant;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Restaurant not found');
    }
  }

  static async postReview(review) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      };

      const response = await fetch(API_ENDPOINT.REVIEW, options);
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default SumberResto;
