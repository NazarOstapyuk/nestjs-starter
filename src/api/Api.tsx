import axios from "axios"



const instance = axios.create({
    baseURL:'http://api.openweathermap.org/data/2.5/weather',
})
const key = 'bb72412ab21719a7d5f89efde37bd94f'
export const weatherApi = {
    getCurrentWeather(city:string){
        return instance.get(`?q=${city}${'&units=metric'}&appid=${key}`)
    }
}
