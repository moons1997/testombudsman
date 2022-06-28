import ApiService from "../api.service";
const NewsService = {
  GetList(data) {
    return ApiService.post(`/news/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/news/Get`);
    } else {
      return ApiService.get(`/news/Get/${id}`);
    }
  },
  GetAsSelectList(level) {
    return ApiService.get(`/news/GetAsSelectList?level=${level}`);
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/news/Create`, data);
    } else {
      return ApiService.post(`/news/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/news/Delete/${id}`);
  },
  UploadNewsImage(data) {
    return ApiService.post(`/news/UploadNewsImage`, data);
  },
  GetNewsImage(id) {
    return ApiService.print(`/news/GetNewsImage/${id}`);
  },
};
export default NewsService;
