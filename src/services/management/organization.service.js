import ApiService from "../api.service";
const OrganizationService = {
  GetList(data) {
    return ApiService.post(`/Organization/GetList`, data);
  },
  Get(id) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/Organization/Get`);
    } else {
      return ApiService.get(`/Organization/Get/${id}`);
    }
  },
  Update(data) {
    if (data.id == 0) {
      return ApiService.post(`/Organization/Create`, data);
    } else {
      return ApiService.post("/Organization/Update", data);
    }
  },
  Delete(id) {
    return ApiService.post(`/Organization/Delete/${id}`);
  },
  GetAsSelectList(parentId, authorizedOnly, inspectionOnly) {
    var params = {};
    if (parentId !== undefined && parentId !== null) {
      params["parentId"] = parentId;
    }
    if (authorizedOnly !== undefined) {
      params["authorizedOnly"] = authorizedOnly;
    }
    if (inspectionOnly !== undefined) {
      params["inspectionOnly"] = inspectionOnly;
    }
    let url = `/Organization/GetAsSelectList`;
    var joinSymbol = "?";
    if (Object.keys(params).length == 0) {
      return ApiService.get(url);
    } else {
      Object.keys(params).forEach((e) => {
        url = `${url}${joinSymbol}${e}=${params[e]}`;
        joinSymbol = "&";
      });
      return ApiService.get(url);

      // if (parentId === undefined) {
      //   url = `${url}?authorizedOnly=${authorizedOnly}&inspectionOnly=${inspectionOnly}`;
      //   return ApiService.get(url);
      // } else {
      //   url = `${url}?parentId=${parentId}&authorizedOnly=${authorizedOnly}&inspectionOnly=${inspectionOnly}`;
      //   return ApiService.get(url);
      // }

      // return ApiService.get(
      //   `/Organization/GetAsSelectList?parentId=${parentId}&authorizedOnly=${authorizedOnly}&inspectionOnly=${inspectionOnly}`
      // );
    }
  },
  GetByInn(inn) {
    return ApiService.get(`/Organization/GetByInn/${inn}`);
  },
  SaveAsExecel(data) {
    return ApiService.printtemp(`/Organization/SaveAsExecel`, data);
  },
};
export default OrganizationService;
