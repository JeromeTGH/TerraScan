import React, { useEffect, useState } from 'react';
import styles from './_Undelegations.module.scss';
import { getUndelegations } from './getUndelegations';
import { Link } from 'react-router-dom';
import { tblValidators } from '../../application/AppData';
import { metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';

const Undelegations = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblUndelegations, setTblUndelegations] = useState();
    const [msgErreur, setMsgErreur] = useState();


    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {
        setIsLoading(true);
        // Récupération de la balance de ce compte
        getUndelegations(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setTblUndelegations(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblUndelegations(res);
                setIsLoading(false);
                setMsgErreur("");                
            }
        })
    }, [props.accountAddress])


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
                            {tblUndelegations.map((element, index) => {
                                return <div key={index} className={styles.undelegation}>
                                    <div className={styles.blockTitle}>
                                        <div className={styles.textTitle}>Undelegation {index+1}/{tblUndelegations.length}</div>
                                    </div>
                                    <div className={styles.fromValidator}>From validator <Link to={'/validators/' + element.valoperAddress}>{element.valMoniker}</Link> {tblValidators[element.valoperAddress].status !== 'active' ? <span className={styles.jailed}>JAILED</span> : null}</div>
                                    <div key={index} className={styles.amountAndReleaseInfos}>
                                        <div>
                                            <span>→ Undelegating </span>
                                            <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.balance)}</span>
                                            <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.balance)}</span>
                                            <span> LUNC</span>
                                        </div>
                                        <div className={styles.releaseDatetime}>(will be released at <strong>{metEnFormeDateTime(element.releaseDatetime)}</strong>)</div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </>
            }
        </>
    );
};

export default Undelegations;