import React, { useEffect } from 'react';

const BtnJourNuit = () => {

    const setLightTheme = () => {
        document.querySelector("body").setAttribute("data-theme", "light");
        localStorage.setItem("terrascan-themecolor", "light");
    }
    
    const setDarkTheme = () => {
        document.querySelector("body").setAttribute("data-theme", "dark");
        localStorage.setItem("terrascan-themecolor", "dark");
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
    
    const switchDeTheme = () => {
        // Passage de dark à light, ou de light à dark, selon l'état précédent
        if(document.querySelector("body").getAttribute("data-theme") === "dark")
            setLightTheme();
        else
            setDarkTheme();
    }
    
    return (
        <>
            <button onClick={switchDeTheme}>Jour/Nuit</button>
        </>
    );
};

export default BtnJourNuit;