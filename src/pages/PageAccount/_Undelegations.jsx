import React, { useEffect, useState } from 'react';
import styles from './_Undelegations.module.scss';
import { getUndelegations } from './getUndelegations';
import { Link } from 'react-router-dom';
import { tblValidators } from '../../application/AppData';
import { metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import { LeftArrowIcon, RightArrowIcon } from '../../application/AppIcons';

const Undelegations = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblUndelegations, setTblUndelegations] = useState();
    const [msgErreur, setMsgErreur] = useState();
    
    const [idxUndelegationToShow, setIdxUndelegationToShow] = useState(0);
    const [tblUndelegation, setTblUndelegation] = useState();


    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {
        setIsLoading(true);
        setIdxUndelegationToShow(0);
        // Récupération de la balance de ce compte
        getUndelegations(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setTblUndelegations(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblUndelegation(res[0]);
                setTblUndelegations(res);
                setIsLoading(false);
                setMsgErreur("");
            }
        })
    }, [props.accountAddress])


    // Changement de tableau à afficher
    useEffect(() => {
        if(tblUndelegations)
            setTblUndelegation(tblUndelegations[idxUndelegationToShow])
        // eslint-disable-next-line
    }, [idxUndelegationToShow])


    // Navigation
    const handleClickOnNavigationButtons = (variation) => {
        if(tblUndelegations) {
            if(variation === 1)
                if((idxUndelegationToShow + 1) < tblUndelegations.length)
                    setIdxUndelegationToShow(idxUndelegationToShow + 1);
            if(variation === -1)
                if((idxUndelegationToShow - 1) >= 0)
                    setIdxUndelegationToShow(idxUndelegationToShow - 1);
        }
    }


    // Affichage
    return (
        <>
            <br />
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
                :
                isLoading ?
                    <div>Loading "undelegations" from blockchain (lcd), please wait ...</div>
                :
                    <>
                        <div className={styles.container}>
                            {tblUndelegation ?
                                <div className={styles.undelegation}>
                                    <div className={styles.blockTitle}>
                                        <div className={styles.textTitle}>Undelegation {idxUndelegationToShow+1}/{tblUndelegations.length}</div>
                                        <div className={styles.textAdd}>
                                            <button onClick={() => handleClickOnNavigationButtons(-1)}><LeftArrowIcon /></button>
                                            <button onClick={() => handleClickOnNavigationButtons(1)}><RightArrowIcon /></button>
                                        </div>
                                    </div>
                                    <div className={styles.fromValidator}>From validator <Link to={'/validators/' + tblUndelegation.valoperAddress}>{tblUndelegation.valMoniker}</Link> {tblValidators[tblUndelegation.valoperAddress].status !== 'active' ? <span className={styles.jailed}>JAILED</span> : null}</div>
                                    <div className={styles.amountAndReleaseInfos}>
                                        <div>
                                            <span>→ Undelegating </span>
                                            <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblUndelegation.balance)}</span>
                                            <span className='partieDecimale'>{retournePartieDecimaleFixed6(tblUndelegation.balance)}</span>
                                            <span> LUNC</span>
                                        </div>
                                        <div className={styles.releaseDatetime}>(will be released at <strong>{metEnFormeDateTime(tblUndelegation.releaseDatetime)}</strong>)</div>
                                    </div>
                                </div>
                            : null}
                        </div>
                    </>
            }
        </>
    );
};

export default Undelegations;