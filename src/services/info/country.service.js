import ApiService from "../api.service";
const CountryService = {
    GetList(data){
        return ApiService.post('/country/GetList',data)
    },
    Get(id){
        if(id == 0 || id === null || id === undefined){
            return ApiService.get('/country/Get')
        }
        else{
            return ApiService.get(`/country/Get/${id}`)
        }
    },
    Update(data){
        if(data.id == 0){
            return ApiService.post(`/country/Create`,data)
        }
        else{
            return ApiService.post(`/country/Update`,data)
        }
        
    },
    Delete(id){
        return ApiService.post(`/country/Delete/${id}`)
    },
    GetAsSelectList(){
        return ApiService.get(`/Country/GetAsSelectList`)
    }
}
export default CountryService