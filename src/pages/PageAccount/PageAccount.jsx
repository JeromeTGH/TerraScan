import React, { useEffect, useState } from 'react';

import { chainID, chainLCDurl } from '../../application/AppParams';
import { AccAddress, LCDClient } from '@terra-money/terra.js';

import { AccountIcon } from '../../application/AppIcons';
import { Link, useParams } from 'react-router-dom';
import styles from './PageAccount.module.scss';
import BlockBalances from './BlockBalances';
import BlockDelegations from './BlockDelegations';
import BlockOtherAssets from './BlockOtherAssets';
import { tblCorrespondanceCompte } from '../../application/AppParams';
import BlockUndelegations from './BlockUndelegations';
// import BlockTransactions from './BlockTransactions';

const PageAccount = () => {

    // Récupération du numéro de compte, passé en argument
    const { cptNum } = useParams();

    // Récupération du nom du compte, si "reconnu" (par exemple : Burn wallet, Oracle Pool ...... sinon, afficher simplement 'Account')
    const cptDesignation = tblCorrespondanceCompte[cptNum] ? tblCorrespondanceCompte[cptNum] : "Account";

    // Récupération des infos validateur, si c'est "son compte"
    const [infosValidateur, setInfosValidateur] = useState(null);
    useEffect(() => {

        // Connexion au LCD
        const lcd = new LCDClient({
            URL: chainLCDurl,
            chainID: chainID,
            isClassic: true
        });

        // Récupération de la liste de tous les validateurs (pour récupérer leur adresse validateur puis terra1, en fait)
        lcd.staking.validators({'pagination.limit': '9999'}).then(rawValidators => {
            if(rawValidators[0]) {
                rawValidators[0].forEach(element => {
                    if(AccAddress.fromValAddress(element.operator_address) === cptNum) {
                        setInfosValidateur([element.operator_address, element.description.moniker]);
                    }
                })
            } else {
                setInfosValidateur('ERROR : failed to fetch [validators] ...')
            }
        }).catch(err => {
            setInfosValidateur('ERROR : failed to fetch [validators] ...')
            console.log(err);
        })


    }, [cptNum])

    // Affichage
    return (
        <>
            <h1><span><AccountIcon /><strong>{cptDesignation}</strong></span></h1>
            <p className={styles.accountAddress}>→ Address : <strong>{cptNum}</strong></p>
            {infosValidateur ? <p className={styles.valInfos}><br />=====&gt; This is the account of <Link to={"/validators/" + infosValidateur[0]}>{infosValidateur[1]}</Link> validator.</p> : null}
            <br />
            <div className={styles.blocksAccountPage}>
                <BlockBalances accountAddress={cptNum} />
                <BlockOtherAssets accountAddress={cptNum} />
                <BlockDelegations accountAddress={cptNum} />
                <BlockUndelegations accountAddress={cptNum} />
                {/* <BlockTransactions accountAddress={cptNum} /> */}
            </div>
        </>
    );
};

export default PageAccount;