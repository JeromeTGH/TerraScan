import React, { useEffect, useState } from 'react';
import { appName } from '../../application/AppParams';
import { AccountIcon } from '../../application/AppIcons';
import { Link, useParams } from 'react-router-dom';
import styles from './PageAccount.module.scss';
import { tblCorrespondanceCompte } from '../../application/AppParams';
import { tblValidators } from '../../application/AppData';
import AvailableCoins from './_AvailableCoins';
import Undelegations from './_Undelegations';
import Delegations from './_Delegations';
import Transactions from './_Transactions';
import Redelegations from './_Redelegations';


const PageAccount = () => {

    // Récupération du numéro de compte, passé en argument
    const { cptNum } = useParams();

    // Récupération du nom du compte, si "reconnu" (par exemple : Burn wallet, Oracle Pool ...... sinon, afficher simplement 'Account')
    const cptDesignation = tblCorrespondanceCompte[cptNum] ? tblCorrespondanceCompte[cptNum] : "Account";

    // Récupération des infos validateur, si c'est "son compte"
    const [infosValidateur, setInfosValidateur] = useState(null);


    // Exécution au démarrage, et à chaque changement de cptNum
    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Account "' + cptNum + '" - ' + appName;

    
        // Vérification au niveau de la liste des validateurs, pour voir si ce compte ne serait pas l'un des leurs
        let valoperAdr = null;
        let valName = null;
        const isValidatorAccount = Object.entries(tblValidators).find(lg => lg[1].terra1_account_address === cptNum);
        if(isValidatorAccount) {
            valoperAdr = isValidatorAccount[0];
            valName = isValidatorAccount[1].description_moniker;
        }
        if(valoperAdr && valName)
            setInfosValidateur([valoperAdr, valName]);

    }, [cptNum])

    // Affichage
    return (
        <>
            <h1><span><AccountIcon /><strong>{cptDesignation}</strong></span></h1>
            <p className={styles.accountAddress}>→ Address : <strong>{cptNum}</strong></p>
            {infosValidateur ? <p className={styles.valInfos}><br />====&gt; This is the account of <Link to={"/validators/" + infosValidateur[0]}>{infosValidateur[1]}</Link> validator.</p> : null}
            <AvailableCoins accountAddress={cptNum} />
            <Delegations accountAddress={cptNum} />
            <Redelegations accountAddress={cptNum} />
            <Undelegations accountAddress={cptNum} />
            <Transactions accountAddress={cptNum} />
        </>
    );
};

export default PageAccount;