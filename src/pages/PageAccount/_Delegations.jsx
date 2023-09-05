import React, { useEffect, useState } from 'react';
import styles from './_Delegations.module.scss';
import { getDelegations } from './getDelegations';
import { Link } from 'react-router-dom';
import { tblValidators } from '../../application/AppData';
import { metEnFormeAmountPartieEntiere, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import { LeftArrowIcon, RightArrowIcon } from '../../application/AppIcons';

const Delegations = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblDelegations, setTblDelegations] = useState();
    const [msgErreur, setMsgErreur] = useState();
    
    const [isMinorCoinsVisible, setIsMinorCoinsVisible] = useState();

    const [idxDelegationToShow, setIdxDelegationToShow] = useState(0);
    const [tblDelegation, setTblDelegation] = useState();


    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {
        setIsLoading(true);
        setIdxDelegationToShow(0);
        setTblDelegation([])
        // Récupération de la balance de ce compte
        getDelegations(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setTblDelegations(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                if(res) {
                    setIsMinorCoinsVisible(new Array(res.length).fill(false))
                    setTblDelegation(res[0]);
                }
                setTblDelegations(res);
                setIsLoading(false);
                setMsgErreur("");                
            }
        })
    }, [props.accountAddress])


    // Changement de tableau à afficher
    useEffect(() => {
        if(tblDelegations)
            setTblDelegation(tblDelegations[idxDelegationToShow])
        // eslint-disable-next-line
    }, [idxDelegationToShow])


    // Navigation
    const handleClickOnNavigationButtons = (variation) => {
        if(tblDelegations) {
            if(variation === 1)
                if((idxDelegationToShow + 1) < tblDelegations.length)
                    setIdxDelegationToShow(idxDelegationToShow + 1);
            if(variation === -1)
                if((idxDelegationToShow - 1) >= 0)
                    setIdxDelegationToShow(idxDelegationToShow - 1);
        }
    }


    // HandleClick pour l'expansion/rétrécissement de l'affichage des "minor coins"
    const handleClickShowHide = (index) => {
        const tblCoinsVisibles = [];
        tblCoinsVisibles.push(...isMinorCoinsVisible);
        tblCoinsVisibles[index] = !tblCoinsVisibles[index];
        setIsMinorCoinsVisible(tblCoinsVisibles);
    }

    // Affichage
    return (
        <>
            <br />
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
                :
                isLoading ?
                    <div>Loading "delegations" from blockchain (lcd), please wait ...</div>
                :
                    <>
                        <div className={styles.container}>
                            {tblDelegation ?
                                <div className={styles.delegation}>
                                    <div className={styles.blockTitle}>
                                        <div className={styles.textTitle}>Delegation {idxDelegationToShow+1}/{tblDelegations.length}</div>
                                        <div className={styles.textAdd}>
                                            <button onClick={() => handleClickOnNavigationButtons(-1)}><LeftArrowIcon /></button>
                                            <button onClick={() => handleClickOnNavigationButtons(1)}><RightArrowIcon /></button>
                                        </div>
                                    </div>
                                    <div>To validator <Link to={'/validators/' + tblDelegation.valoperAddress}>{tblDelegation.valMoniker}</Link> {tblValidators[tblDelegation.valoperAddress].status !== 'active' ? <span className={styles.jailed}>JAILED</span> : null}</div>
                                    <div>→ Are delegated <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblDelegation.amountStaked)}</span><span className='partieDecimale'>{retournePartieDecimaleFixed6(tblDelegation.amountStaked)}</span> LUNC</div>
                                    {tblValidators[tblDelegation.valoperAddress].status === 'active' ?
                                        <>
                                            <div className={styles.coinContainer}>
                                                <div className={styles.coin}>
                                                    <div className={styles.coinImageAndLabel}>
                                                        <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                                        <span><strong>LUNC</strong></span>
                                                    </div>
                                                    <div className={styles.coinValue}>
                                                        <strong>
                                                            <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblDelegation.rewards[0].amount)}</span>
                                                            <span className='partieDecimale'>{retournePartieDecimaleFixed6(tblDelegation.rewards[0].amount)}</span>
                                                        </strong>
                                                    </div>
                                                </div>
                                                <div className={styles.coin}>
                                                    <div className={styles.coinImageAndLabel}>
                                                        <img src={'/images/coins/USTC.png'} alt='USTC logo' />
                                                        <span><strong>USTC</strong></span>
                                                    </div>
                                                    <div className={styles.coinValue}>
                                                        <strong>
                                                            <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblDelegation.rewards[1].amount)}</span>
                                                            <span className='partieDecimale'>{retournePartieDecimaleFixed6(tblDelegation.rewards[1].amount)}</span>
                                                        </strong>
                                                    </div>
                                                </div>
                                                {isMinorCoinsVisible && isMinorCoinsVisible[idxDelegationToShow] ? tblDelegation.rewards.map((element2, index2) => {
                                                    return (index2 > 1) ? <div key={index2} className={styles.coin}>
                                                        <div className={styles.coinImageAndLabel}>
                                                            <img src={'/images/coins/' + element2.denom + '.png'} alt={element2.denom + ' logo'} />
                                                            <span>{element2.denom}</span>
                                                        </div>
                                                        <div className={styles.coinValue}>
                                                            <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element2.amount)}</span>
                                                            <span className='partieDecimale'>{retournePartieDecimaleFixed6(element2.amount)}</span>
                                                        </div>
                                                    </div> : null
                                                }) : null}
                                            </div>
                                            <span className={styles.showhide} onClick={() => handleClickShowHide(idxDelegationToShow)}>{isMinorCoinsVisible[idxDelegationToShow] ? "<< hide minor pending rewards" : "Show other pending rewards >>"}</span>
                                        </>
                                    : <br /> }
                                </div>
                            : null}
                        </div>
                    </>
            }
        </>
    );
};

export default Delegations;