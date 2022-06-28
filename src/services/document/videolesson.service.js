import ApiService from "../api.service";

const VideoLessonService = {
  GetList(data) {
    return ApiService.post("/videolesson/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/videolesson/Get");
    } else {
      return ApiService.get(`/videolesson/Get/${id}`);
    }
  },
  GetAsSelectList(data) {
    return ApiService.post(`/videolesson/GetAsSelectList`, data);
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/videolesson/Create`, data);
    } else {
      return ApiService.post(`/videolesson/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/videolesson/Delete/${id}`);
  },
};
export default VideoLessonService;
