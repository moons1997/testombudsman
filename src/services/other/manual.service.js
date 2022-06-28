import ApiService from "../api.service";

const ManualService = {
  StateSelectList() {
    return ApiService.get(`manual/StateSelectList`);
  },
  OrderTypeSelect() {
    return ApiService.get(`manual/OrderTypeSelectList`);
  },
  GetModuleSelectList() {
    return ApiService.get(`manual/GetModuleSelectList`);
  },
  LanguageSelectList() {
    return ApiService.get(`manual/LanguageSelectList`);
  },
  CheckTypeSelectList() {
    return ApiService.get(`/manual/CheckTypeSelectList`);
  },
  StatusSelectList() {
    return ApiService.get(`/manual/StatusSelectList`);
  },
  ConclusionSelectList() {
    return ApiService.get(`/manual/ConclusionSelectList`);
  },
  AttestationStatusSelectList() {
    return ApiService.get(`/manual/AttestationStatusSelectList`);
  },
};
export default ManualService;
