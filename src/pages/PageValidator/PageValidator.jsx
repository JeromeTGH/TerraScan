import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './PageValidator.module.scss';
import { appName } from '../../application/AppParams';
import { tblValidators } from '../../application/AppData';
import Presentation from './_Presentation';
import Commissions from './_Commissions';
import Staking from './_Staking';
import Delegators from './_Delegators';
import StyledBox from '../../sharedComponents/StyledBox';
import { loadNbStakedLunc } from '../../dataloaders/loadNbStakedLunc';


const PageValidator = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { valAdr } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    // Variables React
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();


    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Validator "' + valAdr + '" - ' + appName;

        // Récupération de la transaction ciblée
        setIsLoading(true);
        loadNbStakedLunc().then((res) => {
            if(res['erreur']) {
                setMsgErreur(res['erreur']);
            }
            else {
                setMsgErreur('');
                setIsLoading(false);
            }
        })
    }, [valAdr])
    

    return (
        <>
            <h1><span><CalculatorIcon /><strong>Validator</strong></span></h1>
            <p className={styles.validatorAddress}>→ Address : <strong>{valAdr}</strong></p>
            {msgErreur ?
                <StyledBox title="ERROR" color="red"><span className='erreur'>{msgErreur}</span></StyledBox>
            :
                isLoading ?
                    <StyledBox title="Loading" color="blue">Loading data from blockchain (lcd), please wait ...</StyledBox>
                :
                    tblValidators[valAdr] ?
                        <div className={styles.blocksValidatorPage}>
                            <Presentation valAddress={valAdr} />
                            <Staking valAddress={valAdr} />
                            <Commissions valAddress={valAdr} />
                            <Delegators valAddress={valAdr} />
                        </div>
                    :
                        <div className='erreur'>Address not found, sorry ...</div>
            }
        </>
    );
};

export default PageValidator;