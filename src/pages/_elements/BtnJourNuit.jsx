import React from 'react';
import { SunIcon, MoonIcon, FilledSunIcon, FilledMoonIcon } from '../../application/AppIcons';
import { AppContext } from '../../application/AppContext';

const BtnJourNuit = (props) => {

    const { theme, setLightTheme, setDarkTheme } = AppContext();
    
    return (
        <>
            {theme === "light" ? (
                (
                    props.filled || props.filled === "yes" ? 
                    <FilledMoonIcon onClick={() => setDarkTheme()} /> :
                    <MoonIcon onClick={() => setDarkTheme()} />
                )
                ) : (
                    props.filled || props.filled === "yes" ? 
                    <FilledSunIcon onClick={() => setLightTheme()} /> :
                    <SunIcon onClick={() => setLightTheme()} />
                )
            }
        </>
    );
};

export default BtnJourNuit;