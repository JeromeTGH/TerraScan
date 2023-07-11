import React, { createContext, useContext, useState } from 'react';

const MonContexte = createContext();

const Contexte = ({children}) => {

    const selectedTheme = localStorage.getItem("terrascan-themecolor");

    const [theme, setTheme] = useState(selectedTheme);

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

    return (
        <MonContexte.Provider value={{theme, setLightTheme, setDarkTheme}}>
            {children}
        </MonContexte.Provider>
    );
};

export default Contexte;

export const AppContext = () => {
    return useContext(MonContexte)
}