import React from 'react';
import { useParams } from 'react-router-dom';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './PageValidator.module.scss';
import BlockValInfos from './BlockValInfos';
import BlockValDetails from './BlockValDetails';
import BlockTopDelegators from './BlockTopDelegators';

const PageValidator = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { valAdr } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    return (
        <>
            <h1><span><CalculatorIcon /><strong>Validator</strong></span></h1>
            <p className={styles.validatorAddress}>→ Address : <strong>{valAdr}</strong></p>
            <br />
            <div className={styles.blocksValidatorPage}>
                <BlockValInfos valAddress={valAdr} />
                <BlockValDetails valAddress={valAdr} />
                <BlockTopDelegators valAddress={valAdr} />
            </div>
        </>
    );
};

export default PageValidator;