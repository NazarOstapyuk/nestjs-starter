import {AppStateType} from "../redux/store";

export const getCurrentWeather=(state:AppStateType)=>{
    return state.currentPage.weather
}
export const getCity=(state:AppStateType)=>{
    return state.currentPage.city
}