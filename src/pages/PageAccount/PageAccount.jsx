import React from 'react';
import { AccountIcon } from '../../application/AppIcons';
import { useParams } from 'react-router-dom';
import styles from './PageAccount.module.scss';
import BlockBalances from './BlockBalances';
import BlockDelegations from './BlockDelegations';
import BlockOtherAssets from './BlockOtherAssets';
import { tblCorrespondanceCompte } from '../../application/AppParams';

const PageAccount = () => {

    // Récupération du numéro de compte, passé en argument
    const { cptNum } = useParams();

    // Récupération du nom du compte, si "reconnu" (par exemple : Burn wallet, Oracle Pool ...... sinon, afficher simplement 'Account')
    const cptDesignation = tblCorrespondanceCompte[cptNum] ? tblCorrespondanceCompte[cptNum] : "Account";

    // Affichage
    return (
        <>
            <h1><span><AccountIcon /><strong>{cptDesignation}</strong></span></h1>
            <p className={styles.accountAddress}>→ Address : <strong>{cptNum}</strong></p>
            <br />
            <div className={styles.blocksAccountPage}>
                <BlockBalances accountAddress={cptNum} />
                <BlockOtherAssets accountAddress={cptNum} />
                <BlockDelegations accountAddress={cptNum} />
            </div>
        </>
    );
};

export default PageAccount;