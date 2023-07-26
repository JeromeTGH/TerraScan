import React from 'react';
import { useParams } from 'react-router-dom';

const PageValidator = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { valAdr } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    return (
        <div>
            Validator "{valAdr ? valAdr : '???'}"<br />
            <br />
            Page to come, but later ...
        </div>
    );
};

export default PageValidator;