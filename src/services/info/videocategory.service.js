import ApiService from "../api.service";
const VideoCategoryService = {
  GetList(data) {
    return ApiService.post("/videocategory/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/videocategory/Get");
    } else {
      return ApiService.get(`/videocategory/Get/${id}`);
    }
  },
  GetAsSelectList(data) {
    return ApiService.get(`/videocategory/GetAsSelectList`);
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/videocategory/Create`, data);
    } else {
      return ApiService.post(`/videocategory/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/videocategory/Delete/${id}`);
  },
};
export default VideoCategoryService;
