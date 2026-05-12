import axiosInstance from "@/config/axios.config";

export class BaseService {
  #path;

  constructor(path = "") {
    this.#path = path;
  }

  getUrl(endpoint = "") {
    if (!endpoint.startsWith("/")) {
      endpoint = `/${endpoint}`;
    }
    return `${this.#path}${endpoint}`;
  }

  async post(endpoint = "", data = {}, config = {}) {
    const response = await axiosInstance.post(this.getUrl(endpoint), data, config);
    return response;
  }

  async get(endpoint = "", config = {}) {
    const response = await axiosInstance.get(this.getUrl(endpoint), config);
    return response;
  }

  async put(endpoint = "", data = {}, config = {}) {
    const response = await axiosInstance.put(this.getUrl(endpoint), data, config);
    return response;
  }

  async patch(endpoint = "", data = {}, config = {}) {
    const response = await axiosInstance.patch(this.getUrl(endpoint), data, config);
    return response;
  }

  async delete(endpoint = "", config = {}) {
    const response = await axiosInstance.delete(this.getUrl(endpoint), config);
    return response;
  }
}
