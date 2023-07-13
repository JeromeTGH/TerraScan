import React, { useEffect } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
// import { BrowserRouter, Routes, Route, Navigate, ScrollRestoration } from 'react-router-dom';

import PageBuilder from './Builder/PageBuilder';

const AppRoutes = () => {

    const router = createBrowserRouter(
        [
            {
                path: "/",
                element: <PageBuilder targetPage="/" withHeader="no" withFooter="no" />
            },
            {
                path: "/search",
                element: <PageBuilder targetPage="/search" withHeader="no" withFooter="no" />
            },
            {
                path: "/404",
                element: <PageBuilder targetPage="/404" withHeader="no" withFooter="no" />
            },
            {
                path: "*",
                element: <Navigate replace to="404" />}
        ]
    )
    
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
        // <BrowserRouter>
        //     <Routes>
        //         <Route path="/" exact element={<PageBuilder targetPage="/" withHeader="no" withFooter="no" />}/>
        //         <Route path="/about" exact element={<PageBuilder targetPage="/about" withHeader="no" withFooter="no" />}/>

        //         <Route path="/search" exact element={<PageBuilder targetPage="/search" withHeader="no" withFooter="no" />}/>
        //         <Route path="/404" exact element={<PageBuilder targetPage="/404" withHeader="no" withFooter="no" />}/>
        //         <Route path="*" element={<Navigate replace to="404" />} />
        //     </Routes>
        //     <ScrollRestoration />
        // </BrowserRouter>
        <RouterProvider router={router} />
    );
};

export default AppRoutes;