import React, { createContext, useContext, useState } from 'react';

const MonContexte = createContext();

const Contexte = ({children}) => {

    const selectedTheme = localStorage.getItem("terrascan-themecolor");
    const liveViewOption = localStorage.getItem("terrascan-liveviewoption") ? localStorage.getItem("terrascan-liveviewoption") : true;      // Activé, par défaut

    const [theme, setTheme] = useState(selectedTheme);
    const [liveViewState, setLiveViewState] = useState(liveViewOption === true || liveViewOption === 'true');       // Conversion "string" vers "boolean"

    const setLightTheme = () => {
        document.querySelector("body").setAttribute("data-theme", "light");
        localStorage.setItem("terrascan-themecolor", "light");
        setTheme("light");
    }
    
    const setDarkTheme = () => {
        document.querySelector("body").setAttribute("data-theme", "dark");
        localStorage.setItem("terrascan-themecolor", "dark");
        setTheme("dark");
    }

    const changeLiveViewStateTo = (etat) => {
        localStorage.setItem("terrascan-liveviewoption", etat);
        setLiveViewState(etat);
    }

    return (
        <MonContexte.Provider value={{theme, setLightTheme, setDarkTheme, liveViewState, changeLiveViewStateTo}}>
            {children}
        </MonContexte.Provider>
    );
};

export default Contexte;

export const AppContext = () => {
    return useContext(MonContexte)
}