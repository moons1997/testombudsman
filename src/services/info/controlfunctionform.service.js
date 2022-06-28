import ApiService from "../api.service";
const ControlFunctionFormService = {
  GetList(data) {
    return ApiService.post("/ControlFunctionForm/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/ControlFunctionForm/Get");
    } else {
      return ApiService.get(`/ControlFunctionForm/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/ControlFunctionForm/Create`, data);
    } else {
      return ApiService.post(`/ControlFunctionForm/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/ControlFunctionForm/Delete/${id}`);
  },
  GetAsSelectList(data) {
    return ApiService.get(`/ControlFunctionForm/GetAsSelectList`, data);
  },
};
export default ControlFunctionFormService;
