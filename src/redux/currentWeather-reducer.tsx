
const WEATHER = 'WEATHER'
const CITY = 'CITY'
export let initialState={
weather:[] as any,
    city:{} as any
}
type InitialState = typeof initialState
const currentWeatherReducer =(state = initialState,action:any):InitialState=>{
switch (action.type) {
    case WEATHER:{
        return {...state,weather:action.weather}
    }
    case CITY:{
        return {...state,city:action.city}
    }
    default:
        return state
}
}

export const setWeather=(weather:any)=>({type:WEATHER,weather})
export const setCity=(city:any)=>({type:CITY,city})


export default currentWeatherReducer