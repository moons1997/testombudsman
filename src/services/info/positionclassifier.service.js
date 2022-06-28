import ApiService from "../api.service";
const PositionClassifierService = {
  GetList(data) {
    return ApiService.post(`/PositionClassifier/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/PositionClassifier/Get`);
    } else {
      return ApiService.get(`/PositionClassifier/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/PositionClassifier/Create`, data);
    } else {
      return ApiService.post(`/PositionClassifier/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/PositionClassifier/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/PositionClassifier/GetAsSelectList`);
  },
};
export default PositionClassifierService;
