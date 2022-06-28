import ApiService from "../api.service";
const ContractorService = {
  GetList(data) {
    return ApiService.post("/Contractor/GetList", data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/Contractor/Get");
    } else {
      return ApiService.get(`/Contractor/Get/${id}`);
    }
  },
  GetByInn(inn) {
    return ApiService.get(`/Contractor/GetByInn/${inn}`);
  },
  Update(data) {
    // if (data.id == 0) {
    //   return ApiService.post(`/Contractor/Create`, data);
    // } else {
    return ApiService.post(`/Contractor/Update`, data);
    // }
  },
  // Send(data) {
  //   return ApiService.post(`/Contractor/Send`, data);
  // },
};
export default ContractorService;
