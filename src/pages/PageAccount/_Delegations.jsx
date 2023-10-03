import React, { useEffect, useState } from 'react';
import styles from './_Delegations.module.scss';
import { getDelegations } from './getDelegations';
import { Link } from 'react-router-dom';
import { tblValidators } from '../../application/AppData';
import { metEnFormeAmountPartieEntiere, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import StyledBox from '../../sharedComponents/StyledBox';

const Delegations = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblDelegations, setTblDelegations] = useState();
    const [msgErreur, setMsgErreur] = useState();
    
    const [isMinorCoinsVisible, setIsMinorCoinsVisible] = useState();
    // const [nbJailedValidators , setNbJailedValidators] = useState(0);

    // const [idxDelegationToShow, setIdxDelegationToShow] = useState(0);
    // const [tblDelegation, setTblDelegation] = useState();


    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {
        setIsLoading(true);
        // setIdxDelegationToShow(0);
        // setTblDelegation(null);
        // setNbJailedValidators(0);

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
                    // setTblDelegation(res[0]);
                }
                setTblDelegations(res);
                setIsLoading(false);
                setMsgErreur("");
                
                // const nbJailed = res.filter(element => element.isJailedValidator === true).length;
                // setNbJailedValidators(nbJailed);
            }
        })
    }, [props.accountAddress])


    // // Changement de tableau à afficher
    // useEffect(() => {
    //     if(tblDelegations)
    //         setTblDelegation(tblDelegations[idxDelegationToShow])
    //     // eslint-disable-next-line
    // }, [idxDelegationToShow])


    // // Navigation
    // const handleClickOnNavigationButtons = (variation) => {
    //     if(tblDelegations) {
    //         if(variation === 1)
    //             if((idxDelegationToShow + 1) < tblDelegations.length)
    //                 setIdxDelegationToShow(idxDelegationToShow + 1);
    //         if(variation === -1)
    //             if((idxDelegationToShow - 1) >= 0)
    //                 setIdxDelegationToShow(idxDelegationToShow - 1);
    //     }
    // }


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
            {msgErreur ?
                <StyledBox title="Delegations" color="orange"><div className="erreur">{msgErreur}</div></StyledBox>
            :
                isLoading ?
                    <StyledBox title="Delegations" color="orange"><div>Loading "delegations" from blockchain (lcd), please wait ...</div></StyledBox>
                :
                    <>
                        <div className={styles.fullView}>
                            {tblDelegations ? tblDelegations.map((element, index) => {
                                return <StyledBox title={<>Delegation {index+1}/{tblDelegations.length}</>} color="orange" key={index}>
                                    <>
                                        <div>There are <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.currentStakedAmount)}</span><span className='partieDecimale'>{retournePartieDecimaleFixed6(element.currentStakedAmount)}</span> LUNC</div>
                                        {/* Message si écart supérieur à 1% et à 1 LUNC, entre le montant actuellement staké, et le montant "initial" */}
                                        {(element.currentStakedAmount/element.initialStakedAmount) < 0.99 && (element.initialStakedAmount-element.currentStakedAmount) > 1 ?
                                            <div className='erreur'>(initially <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.initialStakedAmount)}</span><span className='partieDecimale'>{retournePartieDecimaleFixed6(element.initialStakedAmount)}</span> LUNC / <strong>{((1-(element.currentStakedAmount/element.initialStakedAmount))*100).toFixed(2)}% difference</strong>)</div>
                                        :
                                            null
                                        }
                                        <div>staked with validator <Link to={'/validators/' + element.valoperAddress}>{element.valMoniker}</Link> {tblValidators[element.valoperAddress].status !== 'active' ? <span className='jailed'>JAILED</span> : null}</div>
                                        <div className={styles.coinContainer}>
                                            <div className={styles.coin}>
                                                <div className={styles.coinImageAndLabel}>
                                                    <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                                    <span><strong>LUNC</strong></span>
                                                </div>
                                                <div className={styles.coinValue}>
                                                    <strong>
                                                        <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.rewards[0].amount)}</span>
                                                        <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.rewards[0].amount)}</span>
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
                                                        <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.rewards[1].amount)}</span>
                                                        <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.rewards[1].amount)}</span>
                                                    </strong>
                                                </div>
                                            </div>
                                            {isMinorCoinsVisible && isMinorCoinsVisible[index] ? element.rewards.map((element2, index2) => {
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
                                        <span className={styles.showhide} onClick={() => handleClickShowHide(index)}>{isMinorCoinsVisible[index] ? "<< hide minor pending rewards" : "Show other pending rewards >>"}</span>
                                    </>
                                </StyledBox>
                            }) : null}
                        </div>
                        {/* <div className={styles.partialView}>
                            <StyledBox
                                title={tblDelegations && tblDelegation ? <>Delegation {idxDelegationToShow+1}/{tblDelegations.length}</> : "Delegations"}
                                color="orange"
                                showBtnNav="yes"
                                onPrevious={() => handleClickOnNavigationButtons(-1)}
                                onNext={() => handleClickOnNavigationButtons(1)}
                            >
                                {tblDelegations && tblDelegation ?
                                    <>
                                        <div>There are <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblDelegation.currentStakedAmount)}</span><span className='partieDecimale'>{retournePartieDecimaleFixed6(tblDelegation.currentStakedAmount)}</span> LUNC</div>
                                        {(tblDelegation.currentStakedAmount/tblDelegation.initialStakedAmount) < 0.99 && (tblDelegation.initialStakedAmount-tblDelegation.currentStakedAmount) > 1 ?
                                            <div className='erreur'>(initially <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblDelegation.initialStakedAmount)}</span><span className='partieDecimale'>{retournePartieDecimaleFixed6(tblDelegation.initialStakedAmount)}</span> LUNC / <strong>{((1-(tblDelegation.currentStakedAmount/tblDelegation.initialStakedAmount))*100).toFixed(2)}% difference</strong>)</div>
                                        :
                                            null
                                        }
                                        <div>staked with validator <Link to={'/validators/' + tblDelegation.valoperAddress}>{tblDelegation.valMoniker}</Link> {tblValidators[tblDelegation.valoperAddress].status !== 'active' ? <span className='jailed'>JAILED</span> : null}</div>
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
                                : 
                                    <div>No delegation.</div>
                                }
                                {nbJailedValidators && (nbJailedValidators > 0) ? 
                                    <div className={styles.nbJailedValidators}>
                                        <img src='/images/warning_icon_32x32.png' alt='Warning logo' />
                                        <span className='erreur'>WARNING : there {nbJailedValidators > 1 ? 'are' : 'is'} {nbJailedValidators} validator{nbJailedValidators > 1 ? 's' : null} jailed{tblDelegations.length > 1 ? ' in your delegations' : null}, here</span>
                                    </div>
                                :
                                    null
                                }
                            </StyledBox>
                        </div> */}
                    </>
            }
        </>
    );
};

export default Delegations;