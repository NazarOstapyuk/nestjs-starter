import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import currentWeatherReducer from "./currentWeather-reducer";
let reducers = combineReducers({
  currentPage:currentWeatherReducer
})

type ReducerType = typeof reducers;
export type AppStateType = ReturnType<ReducerType>
let store = createStore(reducers,applyMiddleware(thunk))
export default store
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];