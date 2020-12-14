import axios from 'axios';

export async function invokeAPI(url, { method = 'get', data, params } = {}) {
  const response = await axios({ url, method, data, params });
  console.log(response.data);
  return response.data;
}

export default { invokeAPI };
