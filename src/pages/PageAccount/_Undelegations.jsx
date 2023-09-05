import React, { useEffect, useState } from 'react';
import styles from './_Undelegations.module.scss';
import { getUndelegations } from './getUndelegations';
import { Link } from 'react-router-dom';
import { tblValidators } from '../../application/AppData';
import { metEnFormeAmountPartieEntiere, retournePartieDecimaleFixed6 } from '../../application/AppUtils';

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
                                    {/* <div>Delegated <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.amountStaked)}</span><span className='partieDecimale'>{retournePartieDecimaleFixed6(element.amountStaked)}</span> LUNC</div> */}
                                    {/* <div>To validator <Link to={'/validators/' + element.valoperAddress}>{element.valMoniker}</Link> {tblValidators[element.valoperAddress].status !== 'active' ? <span className={styles.jailed}>JAILED</span> : null}</div> */}
                                    {/* <div className={styles.coinContainer}>
                                        <div className={styles.coin}>
                                            <div className={styles.coinImageAndLabel}>
                                                <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                                <span><strong>LUNC</strong></span>
                                            </div>
                                            <div className={styles.coinValue}>
                                                <strong>
                                                    <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.rewards[0][0])}</span>
                                                    <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.rewards[0][0])}</span>
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
                                                    <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.rewards[1][0])}</span>
                                                    <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.rewards[1][0])}</span>
                                                </strong>
                                            </div>
                                        </div>
                                        {isMinorCoinsVisible && isMinorCoinsVisible[index] ? element.rewards.map((element2, index2) => {
                                            return (index2 > 1) ? <div key={index2} className={styles.coin}>
                                                <div className={styles.coinImageAndLabel}>
                                                    <img src={'/images/coins/' + element2[1] + '.png'} alt={element2[1] + ' logo'} />
                                                    <span>{element2[1]}</span>
                                                </div>
                                                <div className={styles.coinValue}>
                                                    <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element2[0])}</span>
                                                    <span className='partieDecimale'>{retournePartieDecimaleFixed6(element2[0])}</span>
                                                </div>
                                            </div> : null
                                        }) : null}
                                    </div> */}
                                </div>
                            })}
                        </div>
                    </>
            }
        </>
    );
};

export default Undelegations;