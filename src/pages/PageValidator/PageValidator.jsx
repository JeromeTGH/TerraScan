import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './PageValidator.module.scss';
import BlockValInfosV2 from './BlockValInfosV2';
import BlockValDetailsV2 from './BlockValDetailsV2';
import BlockTopDelegators from './BlockTopDelegators';
import { appName } from '../../application/AppParams';
import { loadValidator } from './getValidatorInfos';

const PageValidator = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { valAdr } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    // Variables react
    const [ isLoading, setIsLoading ] = useState(true);
    const [ msgErreurGetValidator, setMsgErreurGetValidator ] = useState();


    // Changement du "title" de la page web
    useEffect(() => {
        document.title = 'Validator "' + valAdr + '" - ' + appName;

        loadValidator(valAdr).then((res) => {
            if(res['erreur']) {
                setMsgErreurGetValidator(res['erreur']);
            }
            else {
                setIsLoading(false);
                setMsgErreurGetValidator('');
            }
        });
    }, [valAdr])
    

    return (
        <>
            <h1><span><CalculatorIcon /><strong>Validator</strong></span></h1>
            <p className={styles.validatorAddress}>→ Address : <strong>{valAdr}</strong></p>
            <br />
            <div className={styles.blocksValidatorPage}>
                {msgErreurGetValidator ?
                    <div className="erreur">{msgErreurGetValidator}</div>
                    :
                    isLoading ?
                        <p>Loading data from blockchain (fcd), please wait ...</p>
                        :
                        <>
                            <BlockValInfosV2 valAddress={valAdr} />
                            <BlockValDetailsV2 valAddress={valAdr} />
                            <BlockTopDelegators valAddress={valAdr} />
                        </>
                    }
            </div>
        </>
    );
};

export default PageValidator;