import React, { useEffect } from 'react';
import { appName } from '../../application/AppParams';
import { ContractIcon } from '../../application/AppIcons';
import { useParams } from 'react-router-dom';
import styles from './PageSmartContract.module.scss';
import ContractInformations from './_ContractInformations';

const PageSmartContract = () => {

    // Récupération du numéro de compte, passé en argument
    const { contractNum } = useParams();

    // Exécution au démarrage, et à chaque changement de cptNum
    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Smart Contract "' + contractNum + '" - ' + appName;

    }, [contractNum])

    // Affichage
    return (
        <>
            <h1><span><ContractIcon /><strong>Smart Contract</strong></span></h1>
            <p className={styles.smartContractAddress}>→ Address : <strong>{contractNum}</strong></p>
            <ContractInformations contractAddress={contractNum} />
        </>
    );
};

export default PageSmartContract;