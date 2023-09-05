import React, { useEffect, useState } from 'react';
import { appName } from '../../application/AppParams';

import { AccountIcon } from '../../application/AppIcons';
import { Link, useParams } from 'react-router-dom';
import styles from './PageAccount.module.scss';
// import BlockBalances from './BlockBalances';
// import BlockDelegations from './BlockDelegations';
// import BlockOtherAssets from './BlockOtherAssets';
import { tblCorrespondanceCompte } from '../../application/AppParams';
// import BlockUndelegations from './BlockUndelegations';
// import BlockTransactions from './BlockTransactions';
import { tblValidators } from '../../application/AppData';
// import { AppContext } from '../../application/AppContext';
import AvailableCoins from './_AvailableCoins';
import Undelegations from './_Undelegations';
import Delegations from './_Delegations';


const PageAccount = () => {

    // Récupération du numéro de compte, passé en argument
    const { cptNum } = useParams();

    // Récupération du nom du compte, si "reconnu" (par exemple : Burn wallet, Oracle Pool ...... sinon, afficher simplement 'Account')
    const cptDesignation = tblCorrespondanceCompte[cptNum] ? tblCorrespondanceCompte[cptNum] : "Account";

    // Récupération des infos validateur, si c'est "son compte"
    const [infosValidateur, setInfosValidateur] = useState(null);

    // Image de fond, centrale
    // const { theme } = AppContext();
    // const imgBlack = "url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"%23303030\" d=\"M8 0l6.61 3h.89a.5.5 0 01.5.5v2a.5.5 0 01-.5.5H15v7a.5.5 0 01.485.38l.5 2a.498.498 0 01-.485.62H.5a.498.498 0 01-.485-.62l.5-2A.501.501 0 011 13V6H.5a.5.5 0 01-.5-.5v-2A.5.5 0 01.5 3h.89L8 0zM3.777 3h8.447L8 1 3.777 3zM2 6v7h1V6H2zm2 0v7h2.5V6H4zm3.5 0v7h1V6h-1zm2 0v7H12V6H9.5zM13 6v7h1V6h-1zm2-1V4H1v1h14zm-.39 9H1.39l-.25 1h13.72l-.25-1z\" ></path></svg>')";
    // const imgWhite = "url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"%23D1D1D1\" d=\"M8 0l6.61 3h.89a.5.5 0 01.5.5v2a.5.5 0 01-.5.5H15v7a.5.5 0 01.485.38l.5 2a.498.498 0 01-.485.62H.5a.498.498 0 01-.485-.62l.5-2A.501.501 0 011 13V6H.5a.5.5 0 01-.5-.5v-2A.5.5 0 01.5 3h.89L8 0zM3.777 3h8.447L8 1 3.777 3zM2 6v7h1V6H2zm2 0v7h2.5V6H4zm3.5 0v7h1V6h-1zm2 0v7H12V6H9.5zM13 6v7h1V6h-1zm2-1V4H1v1h14zm-.39 9H1.39l-.25 1h13.72l-.25-1z\" ></path></svg>')";    
    // const imgAccount = (theme === "light") ?
    //     { backgroundImage: imgBlack }
    // :
    //     { backgroundImage: imgWhite }

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
            {infosValidateur ? <p className={styles.valInfos}><br />=====&gt; This is the account of <Link to={"/validators/" + infosValidateur[0]}>{infosValidateur[1]}</Link> validator.</p> : null}
            <AvailableCoins accountAddress={cptNum} />
            <Delegations accountAddress={cptNum} />
            <Undelegations accountAddress={cptNum} />
            {/* <br />
            <div className={styles.blocksAccountPage} style={imgAccount}>
                <BlockTransactions accountAddress={cptNum} />
            </div> */}
        </>
    );
};

export default PageAccount;