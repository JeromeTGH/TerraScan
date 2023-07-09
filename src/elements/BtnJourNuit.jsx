import React, { useEffect, useState } from 'react';
import { FilledSunIcon, MoonIcon } from '../application/AppIcons';

const BtnJourNuit = () => {

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
            <div style={{ transition: "all 0.5s ease"}} className="pointeur">
                {currentTheme === "light" ? (
                        <MoonIcon onClick={setDarkTheme} />
                    ) : (
                        <FilledSunIcon onClick={setLightTheme} />
                )
                }
            </div>
        </>
    );
};

export default BtnJourNuit;