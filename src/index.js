import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Contexte from './application/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Contexte>
        <App />
    </Contexte>
);
