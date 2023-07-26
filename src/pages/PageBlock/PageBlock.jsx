import React from 'react';
import { useParams } from 'react-router-dom';

const PageBlock = () => {

    // Récupération du numéro de block, éventuellement passé en argument
    const { blockNum } = useParams();

    return (
        <div>
            Block #{blockNum ? blockNum : '???'}<br />
            <br />
            Page to come, but later ...
        </div>
    );
};

export default PageBlock;