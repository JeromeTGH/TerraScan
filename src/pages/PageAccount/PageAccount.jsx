import React from 'react';
import { AccountIcon } from '../../application/AppIcons';
import { useParams } from 'react-router-dom';
import styles from './PageAccount.module.scss';
import BlockGeneral from './BlockGeneral';

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
                <div className={"boxContainer " + styles.generalBlock}>
                    <BlockGeneral accountAddress={cptNum} />
                </div>
                <div className={"boxContainer " + styles.delegations}>
                    Delegations
                </div>
            </div>
        </div>
    );
};

export default PageAccount;