import React, { useEffect } from 'react';
import { appName } from '../../application/AppParams';

const Page404 = () => {

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Page not found - ' + appName;
    }, [])

    return (
        <div>
            <h1>Page not found</h1>
            <br />
            <p>Oops, sorry... can't find this page !</p>
        </div>
    );
};

export default Page404;