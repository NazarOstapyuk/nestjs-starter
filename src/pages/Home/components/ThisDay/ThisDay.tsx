import React, {useEffect} from 'react';
import { GlobalSvgSelector } from '../../../../assets/icons/global/GlobalSvgSelector';

import s from './ThisDay.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {getCity, getCurrentWeather} from "../../../../selected/current-selected";
import {weatherApi} from "../../../../api/Api";
import {setWeather} from "../../../../redux/currentWeather-reducer";
import { Dispatch } from 'redux';






export const ThisDay = () => {


    const current = useSelector(getCurrentWeather)
    const dispatch = useDispatch()
    const city = useSelector(getCity)
    useEffect(()=>{
        weatherApi.getCurrentWeather(city.value ).then(res=>{
            dispatch(setWeather(res.data))
        })
    },[city])



    return (
        <div className={s.this__day}>
            <div className={s.top__block}>
                <div className={s.top__block_wrapper}>
                    <div className={s.this__temp}>{Math.round(current&& current.main && current.main.temp)}°</div>
                    <div className={s.this__day_name}>Сьогодні</div>
                </div>
                <GlobalSvgSelector id="sun" />
            </div>
            <div className={s.bottom__block}>
                <div className={s.this__city}>
                    Місто: <span>{city.label}</span>
                </div>
            </div>


        </div>
    );
};
