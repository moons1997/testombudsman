import ApiService from "../api.service";
const PositionService = {
  GetList(data) {
    return ApiService.post(`/Position/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/Position/Get`);
    } else {
      return ApiService.get(`/Position/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/Position/Create`, data);
    } else {
      return ApiService.post(`/Position/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/Position/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/Position/GetAsSelectList`);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/Position/SaveAsExecel`, data);
  },
};
export default PositionService;
