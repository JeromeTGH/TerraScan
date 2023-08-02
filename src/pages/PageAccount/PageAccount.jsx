import React from 'react';
import { useParams } from 'react-router-dom';

const PageAccount = () => {

    // Récupération du numéro de compte, éventuellement passé en argument
    const { cptNum } = useParams();

    return (
        <div>
            Cpt #{cptNum ? cptNum : '???'}<br />
            <br />
            Page to come, but later ...
        </div>
    );
};

export default PageAccount;