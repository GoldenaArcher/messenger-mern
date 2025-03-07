import axios from "axios";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "http://localhost:5000/api/messenger" }) =>
  async ({ url, method, data, params }, { getState }) => {
    try {
      const state = getState();
      const token = state.auth?.token;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      if (data instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      } else {
        headers["Content-Type"] = "application/json";
      }

      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
