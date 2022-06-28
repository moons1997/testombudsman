import ApiService from "../api.service";
const PersonService = {
    GetList(data){
        return ApiService.post('/person/GetList',data)
    },
    Get(id){
        if(id == 0 || id === null || id === undefined){
            return ApiService.get('/person/Get')
        }
        else{
            return ApiService.get(`/person/Get/${id}`)
        }
    },
    Update(data){
        if(data.id == 0){
            return ApiService.post(`/person/Create`,data)
        }
        else{
            return ApiService.post(`/person/Update`,data)
        }
        
    },
    Delete(id){
        return ApiService.post(`/person/Delete/${id}`)
    },
    GetByInnFromSoliq(lang,pinflOrInn){
        return ApiService.get(`/person/GetByFromSoliq/${lang}/${pinflOrInn}`)
    }
}
export default PersonService