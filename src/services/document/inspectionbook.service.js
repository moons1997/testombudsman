import ApiService from "../api.service";
const InspectionBookService = {
  GetList(data) {
    return ApiService.post("/InspectionBook/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/InspectionBook/Get");
    } else {
      return ApiService.get(`/InspectionBook/Get/${id}`);
    }
  },
  GetByRequestId(id) {
    return ApiService.get(`/InspectionBook/GetByRequestId/${id}`);
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/InspectionBook/Create`, data);
    } else {
      return ApiService.post(`/InspectionBook/Update`, data);
    }
  },
  Send(data) {
    return ApiService.post(`/InspectionBook/Send`, data);
  },
  GetHistoryList(data, id) {
    return ApiService.post(`/InspectionBook/GetHistoryList/${id}`, data);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/InspectionBook/SaveAsExecel`, data);
  },
};
export default InspectionBookService;
