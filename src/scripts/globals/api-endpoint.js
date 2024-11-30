import CONFIG from './config';

const API_ENDPOINT = {
  LIST: `${CONFIG.BASE_URL}list`,  // Keep backticks for template literals
  DETAIL: (id) => `${CONFIG.BASE_URL}detail/${id}`,  // Keep backticks for template literals
  REVIEW: `${CONFIG.BASE_URL}review`,  // Keep backticks for template literals
};

export default API_ENDPOINT;
