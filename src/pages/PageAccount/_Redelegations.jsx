import React, { useEffect, useState } from 'react';
import styles from './_Redelegations.module.scss';
import { getRedelegations } from './getRedelegations';
import { Link } from 'react-router-dom';
import { tblValidators } from '../../application/AppData';
import { expanded_datetime_ago, metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import StyledBox from '../../sharedComponents/StyledBox';

const Redelegations = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblRedelegations, setTblRedelegations] = useState();
    const [msgErreur, setMsgErreur] = useState();
    
    const [idxRedelegationToShow, setIdxRedelegationToShow] = useState(0);
    const [tblRedelegation, setTblRedelegation] = useState();


    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {
        setIsLoading(true);
        setIdxRedelegationToShow(0);
        setTblRedelegation([]);

        // Récupération des redelegations ce compte
        getRedelegations(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setTblRedelegations(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                if(res) {
                    setTblRedelegation(res[0]);
                }
                setTblRedelegations(res);
                setIsLoading(false);
                setMsgErreur("");
            }
        })
    }, [props.accountAddress])


    // Changement de tableau à afficher
    useEffect(() => {
        if(tblRedelegations)
            setTblRedelegation(tblRedelegations[idxRedelegationToShow])
        // eslint-disable-next-line
    }, [idxRedelegationToShow])


    // Navigation
    const handleClickOnNavigationButtons = (variation) => {
        if(tblRedelegations) {
            if(variation === 1)
                if((idxRedelegationToShow + 1) < tblRedelegations.length)
                    setIdxRedelegationToShow(idxRedelegationToShow + 1);
            if(variation === -1)
                if((idxRedelegationToShow - 1) >= 0)
                    setIdxRedelegationToShow(idxRedelegationToShow - 1);
        }
    }


    // Affichage
    return (
        <StyledBox
            title={tblRedelegations && tblRedelegation ? <>Redelegation {idxRedelegationToShow+1}/{tblRedelegations.length}</> : "Redelegations"}
            color="purple"
            showBtnNav="yes"
            onPrevious={() => handleClickOnNavigationButtons(-1)}
            onNext={() => handleClickOnNavigationButtons(1)}
        >
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>Loading "redelegations" from blockchain (lcd), please wait ...</div>
                :
                    tblRedelegations && tblRedelegation ?
                        <>
                            <div className={styles.amountAndReleaseInfos}>
                                <div>
                                    <span>There were </span>
                                    <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblRedelegation.balance)}</span>
                                    <span className='partieDecimale'>{retournePartieDecimaleFixed6(tblRedelegation.balance)}</span>
                                    <span> LUNC</span>
                                </div>
                                <div>redelegating from validator <Link to={'/validators/' + tblRedelegation.validator_src_address}>{tblRedelegation.validator_src_moniker}</Link> {tblValidators[tblRedelegation.validator_src_address].status !== 'active' ? <span className='jailed'>JAILED</span> : null}</div>
                                <div>to validator <Link to={'/validators/' + tblRedelegation.validator_dst_address}>{tblRedelegation.validator_dst_moniker}</Link> {tblValidators[tblRedelegation.validator_dst_address].status !== 'active' ? <span className='jailed'>JAILED</span> : null}</div>
                                <br />
                                <div>Any "same redelegation" <strong>must wait {expanded_datetime_ago(tblRedelegation.releaseDatetime, true)}</strong> ({metEnFormeDateTime(tblRedelegation.releaseDatetime)})</div>
                            </div>
                        </>
                    :
                        <div>No redelegation, currently.</div>
            }
        </StyledBox>
    );
};

export default Redelegations;