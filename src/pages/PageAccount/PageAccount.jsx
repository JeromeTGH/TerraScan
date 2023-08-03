import React from 'react';
import { AccountIcon } from '../../application/AppIcons';
import { useParams } from 'react-router-dom';
import styles from './PageAccount.module.scss';
import BlockBalances from './BlockBalances';
import BlockDelegations from './BlockDelegations';

const PageAccount = () => {

    // Récupération du numéro de compte, passé en argument
    const { cptNum } = useParams();

    // Affichage
    return (
        <div>
            <h1><AccountIcon /><span><strong>Account</strong></span></h1>
            <p>→ Address : <strong>{cptNum}</strong></p>
            <br />
            <div className={styles.blocksAccountPage}>
                <BlockBalances accountAddress={cptNum} />
                <BlockDelegations accountAddress={cptNum} />
            </div>
        </div>
    );
};

export default PageAccount;