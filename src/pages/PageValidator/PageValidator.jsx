import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './PageValidator.module.scss';
import BlockValHeader from './BlockValHeader';
import BlockValLeft from './BlockValLeft';
import BlockTopDelegators from './BlockTopDelegators';
import { appName } from '../../application/AppParams';
import { tblValidators } from '../../application/AppData';


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
            {tblValidators[valAdr] ?
                <div className={styles.blocksValidatorPage}>
                    <BlockValHeader valAddress={valAdr} />
                    <BlockValLeft valAddress={valAdr} />
                    <BlockTopDelegators valAddress={valAdr} />
                </div>
            :
                <div className='erreur'>Address not found, sorry ...</div>
            }
        </>
    );
};

export default PageValidator;