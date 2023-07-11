import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PageBuilder from './Builder/PageBuilder';

const AppRoutes = () => {
    
    useEffect (() => {

        const selectedTheme = localStorage.getItem("terrascan-themecolor");
        
        switch(selectedTheme) {
            case "light":
                document.querySelector("body").setAttribute("data-theme", "light");
                break;
            case "dark":
                document.querySelector("body").setAttribute("data-theme", "dark");
                break;
            default:
                // Theme par défaut, si par exemple, l'utilisateur arrive sur ce site pour la première fois (aucun cas "selectedTheme" serait null)
                document.querySelector("body").setAttribute("data-theme", "light");
        }
        
    }, [])


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<PageBuilder targetPage="/" withHeader="no" withFooter="no" />}/>
                <Route path="/about" exact element={<PageBuilder targetPage="/about" withHeader="no" withFooter="no" />}/>

                <Route path="/search" exact element={<PageBuilder targetPage="/search" withHeader="no" withFooter="no" />}/>
                <Route path="/404" exact element={<PageBuilder targetPage="/404" withHeader="no" withFooter="no" />}/>
                <Route path="*" element={<Navigate replace to="404" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;