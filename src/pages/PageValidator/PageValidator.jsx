import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './PageValidator.module.scss';
import BlockValHeaderV2 from './BlockValHeaderV2';
import BlockValLeftV2 from './BlockValLeftV2';
import BlockTopDelegators from './BlockTopDelegators';
import { appName } from '../../application/AppParams';


const PageValidator = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { valAdr } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)


    // Changement du "title" de la page web
    useEffect(() => {
        document.title = 'Validator "' + valAdr + '" - ' + appName;
    }, [valAdr])
    

    return (
        <>
            <h1><span><CalculatorIcon /><strong>Validator</strong></span></h1>
            <p className={styles.validatorAddress}>→ Address : <strong>{valAdr}</strong></p>
            <br />
            <div className={styles.blocksValidatorPage}>
                <BlockValHeaderV2 valAddress={valAdr} />
                <BlockValLeftV2 valAddress={valAdr} />
                <BlockTopDelegators valAddress={valAdr} />
            </div>
        </>
    );
};

export default PageValidator;