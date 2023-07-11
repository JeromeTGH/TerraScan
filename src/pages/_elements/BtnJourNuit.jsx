import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, FilledSunIcon, FilledMoonIcon } from '../../application/AppIcons';

const BtnJourNuit = (props) => {

    const [currentTheme, setCurrentTheme] = useState();

    const setLightTheme = () => {
        document.querySelector("body").setAttribute("data-theme", "light");
        localStorage.setItem("terrascan-themecolor", "light");
        setCurrentTheme("light");
    }
    
    const setDarkTheme = () => {
        document.querySelector("body").setAttribute("data-theme", "dark");
        localStorage.setItem("terrascan-themecolor", "dark");
        setCurrentTheme("dark");
    }
    
    useEffect (() => {
        const selectedTheme = localStorage.getItem("terrascan-themecolor");
        
        switch(selectedTheme) {
            case "light":
                setLightTheme();
                break;
            case "dark":
                setDarkTheme();
                break;
            default:
                // Theme par défaut, si par exemple, l'utilisateur arrive sur ce site pour la première fois (aucun cas "selectedTheme" serait null)
                setLightTheme();
        }
    }, [])
    
    return (
        <>
            {currentTheme === "light" ? (
                (props.filled || props.filled === "yes" ? 
                    <FilledMoonIcon onClick={setDarkTheme} /> :
                    <MoonIcon onClick={setDarkTheme} />
                )
                ) : (
                    (props.filled || props.filled === "yes" ? 
                    <FilledSunIcon onClick={setLightTheme} /> :
                    <SunIcon onClick={setLightTheme} />
                )
                )
            }
        </>
    );
};

export default BtnJourNuit;