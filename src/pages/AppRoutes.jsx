import React, { useEffect } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
// import { BrowserRouter, Routes, Route, Navigate, ScrollRestoration } from 'react-router-dom';

import PageBuilder from './Builder/PageBuilder';

const AppRoutes = () => {

    const router = createBrowserRouter(
        [
            {
                path: "/",
                element: <PageBuilder targetPage="home" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/accounts",
                element: <PageBuilder targetPage="accounts" withHeader="yes" withFooter="yes" />},
            {
                path: "/accounts/:cptNum",
                element: <PageBuilder targetPage="account" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/blocks",
                element: <PageBuilder targetPage="blocks" withHeader="yes" withFooter="yes" />},
            {
                path: "/blocks/:blockNum",
                element: <PageBuilder targetPage="block" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/transactions",
                element: <PageBuilder targetPage="transactions" withHeader="yes" withFooter="yes" />},
            {
                path: "/transactions/:txHash",
                element: <PageBuilder targetPage="transaction" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/validators",
                element: <PageBuilder targetPage="validators" withHeader="yes" withFooter="yes" />},
            {
                path: "/validators/:valAdr",
                element: <PageBuilder targetPage="validator" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/proposals",
                element: <PageBuilder targetPage="proposals" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/proposals/:propID",
                element: <PageBuilder targetPage="proposal" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/burns",
                element: <PageBuilder targetPage="burns" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/staking",
                element: <PageBuilder targetPage="staking" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/search",
                element: <PageBuilder targetPage="search" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/about-disclaimer",
                element: <PageBuilder targetPage="about-disclaimer" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/donate",
                element: <PageBuilder targetPage="donate" withHeader="yes" withFooter="yes" />
            },
            {
                path: "/404",
                element: <PageBuilder targetPage="404" withHeader="yes" withFooter="yes" />
            },
            {
                path: "*",
                element: <Navigate replace to="404" />
            }
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