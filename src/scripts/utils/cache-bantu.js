import CONFIG from '../globals/config';

const CacheBantu = {
  async cachingAppShell(requests) {
    const cache = await this._openCache();
    await cache.addAll(requests);
  },

  async deleteOldCache() {
    const cacheNames = await caches.keys();
    cacheNames
      .filter((name) => name !== CONFIG.CACHE_NAME)
      .map((filteredName) => caches.delete(filteredName));
  },

  async revalidateCache(request) {
    const response = await caches.match(request);

    if (response) {
      this._fetchRequest(request);
      return response;
    }

    return this._fetchRequest(request);
  },

  async _openCache() {
    return caches.open(CONFIG.CACHE_NAME);
  },

  async _fetchRequest(request) {
    const response = await fetch(request);

    if (!response || response.status !== 200) {
      return response;
    }

    await this._addCache(request);
    return response;
  },

  async _addCache(request) {
    if (request.method !== 'GET') {
      return;
    }

    const cache = await this._openCache();

    const response = await fetch(request);
    await cache.put(request, response.clone());

    return response;
  },

  async cacheAPIResponse(request, response) {
    const cache = await this._openCache();
    await cache.put(request, response.clone());
  }
};

export default CacheBantu;