import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PageBuilder from './PageBuilder';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<PageBuilder targetPage="/" />}/>
                <Route path="/search" exact element={<PageBuilder targetPage="/search" withHeader="no" withFooter="no" />}/>
                <Route path="/404" exact element={<PageBuilder targetPage="/404" />}/>
                {/* <Route path="*" element={<Navigate replace to="404" />} /> */}
                        {/* temporairement désactivé */}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;