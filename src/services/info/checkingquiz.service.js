import ApiService from "../api.service";
const CheckingQuizService = {
  GetList(data) {
    return ApiService.post("/CheckingQuiz/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/CheckingQuiz/Get");
    } else {
      return ApiService.get(`/CheckingQuiz/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/CheckingQuiz/Create`, data);
    } else {
      return ApiService.post(`/CheckingQuiz/Update`, data);
    }
  },
  Delete(id) {
    return ApiService.post(`/CheckingQuiz/Delete/${id}`);
  },
  GetAsSelectList(organizationId) {
    return ApiService.get(
      `/CheckingQuiz/GetAsSelectList?organizationId=${organizationId}`
    );
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/CheckingQuiz/SaveAsExecel`, data);
  },
};
export default CheckingQuizService;
