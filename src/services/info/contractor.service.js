import ApiService from "../api.service";

const ContractorService = {
    GetByInn(inn){
        return ApiService.get(`/Contractor/GetByInn/${inn}`)
    }
}
export default ContractorService