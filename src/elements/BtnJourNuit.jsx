import React, { useEffect } from 'react';
import { SunIcon, MoonIcon, FilledSunIcon, FilledMoonIcon } from '../application/AppIcons';
import { AppContext } from '../application/AppContext';
import { defaultThemeMode } from '../application/AppParams';

const BtnJourNuit = (props) => {

    const { theme, setLightTheme, setDarkTheme } = AppContext();

    useEffect(() => {
        if(!theme) {
            if(defaultThemeMode === "light")
                setLightTheme();
            else
                setDarkTheme();
        }
    }, [theme, setLightTheme, setDarkTheme])
    
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