import React from 'react';
import { useParams } from 'react-router-dom';

const PageTransaction = () => {

    // Récupération du hash de transaction, éventuellement passé en argument
    const { txHash } = useParams();

    return (
        <div>
            TxHash #{txHash ? txHash : '???'}<br />
            <br />
            Page to come, but later ...
        </div>
    );
};

export default PageTransaction;