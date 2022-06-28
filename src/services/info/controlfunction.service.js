import ApiService from "../api.service";
const ControlFunctionService = {
  GetList(data) {
    return ApiService.post("/ControlFunction/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/ControlFunction/Get");
    } else {
      return ApiService.get(`/ControlFunction/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/ControlFunction/Create`, data);
    } else {
      return ApiService.post(`/ControlFunction/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/ControlFunction/Delete/${id}`);
  },
  GetAsSelectList(data) {
    return ApiService.get(`/ControlFunction/GetAsSelectList`, data);
  },
};
export default ControlFunctionService;
