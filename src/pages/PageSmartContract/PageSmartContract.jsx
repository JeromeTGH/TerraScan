import React, { useEffect } from 'react';
import { appName, tblCorrespondanceSmartContract } from '../../application/AppParams';
import { ContractIcon } from '../../application/AppIcons';
import { useParams } from 'react-router-dom';
import styles from './PageSmartContract.module.scss';

const PageSmartContract = () => {

    // Récupération du numéro de compte, passé en argument
    const { contractNum } = useParams();

    // Récupération du nom du compte, si "reconnu" (par exemple : Burn wallet, Oracle Pool ...... sinon, afficher simplement 'Smart Contract')
    const cptDesignation = tblCorrespondanceSmartContract[contractNum] ? tblCorrespondanceSmartContract[contractNum] + " (smart contract)" : "Smart Contract";


    // Exécution au démarrage, et à chaque changement de cptNum
    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Smart Contract "' + contractNum + '" - ' + appName;

    }, [contractNum])

    // Affichage
    return (
        <>
            <h1><span><ContractIcon /><strong>{cptDesignation}</strong></span></h1>
            <p className={styles.accountAddress}>→ Address : <strong>{contractNum}</strong></p>
            <br />
            <br />
            <p>(coming soon)</p>
        </>
    );
};

export default PageSmartContract;