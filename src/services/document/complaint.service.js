import ApiService from "../api.service";
const ComplaintService = {
  GetList(data) {
    return ApiService.post("/Complaint/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/Complaint/Get");
    } else {
      return ApiService.get(`/Complaint/Get/${id}`);
    }
  },
  GetByRequestId(id) {
    return ApiService.get(`/Complaint/GetByRequestId/${id}`);
  },
  // Update(data) {
  //   if (data.id == 0) {
  //     return ApiService.post(`/Complaint/Create`, data);
  //   } else {
  //     return ApiService.post(`/Complaint/Update`, data);
  //   }
  // },
  // Send(data) {
  //   return ApiService.post(`/Complaint/Send`, data);
  // },
  GetHistoryList(data, id) {
    return ApiService.post(`/Complaint/GetHistoryList/${id}`, data);
  },
};
export default ComplaintService;
