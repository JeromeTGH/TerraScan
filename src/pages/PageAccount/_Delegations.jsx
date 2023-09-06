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
    const [nbJailedValidators , setNbJailedValidators] = useState(0);

    const [idxDelegationToShow, setIdxDelegationToShow] = useState(0);
    const [tblDelegation, setTblDelegation] = useState();


    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {
        setIsLoading(true);
        setIdxDelegationToShow(0);
        setTblDelegation(null);
        setNbJailedValidators(0);

        // Récupération des délégations ce compte
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
                
                const nbJailed = res.filter(element => element.isJailedValidator === true).length;
                setNbJailedValidators(nbJailed);
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
            <div className={styles.container}>
                <div className={styles.delegation}>
                    <div className={styles.blockTitle}>
                        <div className={styles.textTitle}>{tblDelegations && tblDelegation ? <>Delegation {idxDelegationToShow+1}/{tblDelegations.length}</> : "Delegations"}</div>
                        <div className={styles.textAdd}>
                            <button onClick={() => handleClickOnNavigationButtons(-1)}><LeftArrowIcon /></button>
                            <button onClick={() => handleClickOnNavigationButtons(1)}><RightArrowIcon /></button>
                        </div>
                    </div>
                    {msgErreur ?
                        <div className={"erreur " + styles.message}>{msgErreur}</div>
                    :
                        isLoading ?
                            <div className={styles.message}>Loading "delegations" from blockchain (lcd), please wait ...</div>
                        :
                            tblDelegations && tblDelegation ?
                                <>
                                    <div>There are <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblDelegation.amountStaked)}</span><span className='partieDecimale'>{retournePartieDecimaleFixed6(tblDelegation.amountStaked)}</span> LUNC</div>
                                    <div>staked with validator <Link to={'/validators/' + tblDelegation.valoperAddress}>{tblDelegation.valMoniker}</Link> {tblValidators[tblDelegation.valoperAddress].status !== 'active' ? <span className={styles.jailed}>JAILED</span> : null}</div>
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
                                </>
                            : 
                                <div className={styles.message}>No delegation.</div>
                    }
                </div>
            </div>
            {nbJailedValidators && (nbJailedValidators > 0) ? 
                <div className={styles.nbJailedValidators}>
                    <img src='/images/warning_icon_32x32.png' alt='Warning logo' />
                    <span className='erreur'>WARNING : you have {nbJailedValidators} validator{nbJailedValidators > 1 ? 's' : null} jailed, in your delegation{tblDelegations.length > 1 ? 's' : null}</span>
                </div>
            :
                null
            }
        </>
    );
};

export default Delegations;