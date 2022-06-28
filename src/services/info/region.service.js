import ApiService from "../api.service";
const RegionService = {
    GetList(data){
        return ApiService.post('/region/GetList',data)
    },
    Get(id){
        if(id == 0 || id === null || id === undefined){
            return ApiService.get('/region/Get')
        }
        else{
            return ApiService.get(`/region/Get/${id}`)
        }
    },
    Update(data){
        if(data.id == 0){
            return ApiService.post(`/region/Create`,data)
        }
        else{
            return ApiService.post(`/region/Update`,data)
        }
        
    },
    Delete(id){
        return ApiService.post(`/region/Delete/${id}`)
    },
    GetAsSelectList(countryId){
        return ApiService.get(`/Region/GetAsSelectList/${countryId}`)
    }
}
export default RegionService