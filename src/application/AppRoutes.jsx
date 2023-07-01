import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import PageBuilder from '../pages/PageBuilder';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<PageBuilder targetPage="/" withHeader="no" withFooter="no" />}/>
                <Route path="/404" exact element={<PageBuilder targetPage="/404" />}/>
                <Route path="*" element={<Navigate replace to="404" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;