import React, {useEffect, useState} from 'react';
import Select from 'react-select';

import {useDispatch} from "react-redux";

import { setCity } from '../../redux/currentWeather-reducer';


export default function Selected({colourStyles}:any) {
    const dispatch = useDispatch()

    const [selectedOption, setSelectedOption] = useState<any>({value: 'Kiev', label: 'Київ'});
    const options = [
        { value: 'Kiev', label: 'Київ' },
        { value: 'Ivano-Frankivsk', label: 'Івано-Франківськ' },
        { value: 'Miami', label: 'Маямі' },
    ];

useEffect(()=>{
    dispatch(setCity(selectedOption))
},[selectedOption])
    return (
        <div className="App">
            <form  >

                <Select
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={options}
                    styles ={colourStyles}
                />
            </form>
        </div>
    );
}










