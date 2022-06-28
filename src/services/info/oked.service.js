import ApiService from "../api.service";
const OkedService = {
  GetList(data) {
    return ApiService.post(`/Oked/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/Oked/Get`);
    } else {
      return ApiService.get(`/Oked/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/Oked/Create`, data);
    } else {
      return ApiService.post(`/Oked/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/Oked/Delete/${id}`);
  },
  GetAsSelectList(level) {
    return ApiService.get(`/Oked/GetAsSelectList?level=${level}`);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/Oked/SaveAsExecel`, data);
  },
};
export default OkedService;
