import ApiService from "../api.service";
const DistrictService = {
    GetList(data){
        return ApiService.post('/district/GetList',data)
    },
    Get(id){
        if(id == 0 || id === null || id === undefined){
            return ApiService.get('/district/Get')
        }
        else{
            return ApiService.get(`/district/Get/${id}`)
        }
    },
    Update(data){
        if(data.id == 0){
            return ApiService.post(`/district/Create`,data)
        }
        else{
            return ApiService.post(`/district/Update`,data)
        }
        
    },
    Delete(id){
        return ApiService.post(`/district/Delete/${id}`)
    },
    GetAsSelectList(regionId ){
        return ApiService.get(`/District/GetAsSelectList/${regionId}`)
    }
}
export default DistrictService