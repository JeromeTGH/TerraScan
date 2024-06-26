import React, { useEffect, useState } from 'react';
import styles from './_AvailableCoins.module.scss';
import { getAvailableCoins } from './getAvailableCoins';
import { metEnFormeAmountPartieEntiere, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import StyledBox from '../../sharedComponents/StyledBox';


const AvailableCoins = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblCoins, setTblCoins] = useState();
    const [msgErreur, setMsgErreur] = useState();

    // const [isMinorCoinsVisible, setIsMinorCoinsVisible] = useState(true);


    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {

        setIsLoading(true);
        setTblCoins([]);

        // Récupération de la balance de ce compte
        getAvailableCoins(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setTblCoins(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblCoins(res);
                setIsLoading(false);
                setMsgErreur("");                
            }
        })

    }, [props.accountAddress])


    // // HandleClick pour l'expansion/rétrécissement de l'affichage des "minor coins"
    // const handleClickShowHide = () => {
    //     setIsMinorCoinsVisible(!isMinorCoinsVisible);
    // }


    // Affichage
    return (
        <StyledBox title="Available" color="green">
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>Loading "available coins" from blockchain (lcd), please wait ...</div>
                :
                    tblCoins.length > 0 ?
                        <>
                            <div className={styles.coinContainer}>
                                <div className={styles.coin}>
                                    <div className={styles.coinImageAndLabel}>
                                        <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                        <span><strong>LUNC</strong></span>
                                    </div>
                                    <div className={styles.coinValue}>
										<span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblCoins[0].amount)}</span>
										<span className='partieDecimale'>{retournePartieDecimaleFixed6(tblCoins[0].amount)}</span>
                                    </div>
                                </div>
                                <div className={styles.coin}>
                                    <div className={styles.coinImageAndLabel}>
                                        <img src={'/images/coins/USTC.png'} alt='USTC logo' />
                                        <span><strong>USTC</strong></span>
                                    </div>
                                    <div className={styles.coinValue}>
										<span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblCoins[1].amount)}</span>
										<span className='partieDecimale'>{retournePartieDecimaleFixed6(tblCoins[1].amount)}</span>
                                    </div>
                                </div>
                                {/* {isMinorCoinsVisible ? tblCoins.map((element, index) => { */}
                                {tblCoins.map((element, index) => {
                                    return (index > 1) ? <div key={index} className={styles.coin}>
                                        <div className={styles.coinImageAndLabel}>
                                            <img src={'/images/coins/' + element.denom + '.png'} alt={element.denom + ' logo'} />
                                            <span>{element.denom}</span>
                                        </div>
                                        <div className={styles.coinValue}>
                                            <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.amount)}</span>
                                            <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.amount)}</span>
                                        </div>
                                    </div> : null
                                })}
                                {/* }) : null} */}
                            </div>
                        </>
                    :
                        <div>No coins.</div>
            }
            {/* <span className={styles.showhide} onClick={() => handleClickShowHide()}>{isMinorCoinsVisible ? "<< hide minor coins" : "Show other coins >>"}</span> */}
        </StyledBox>
    );
};

export default AvailableCoins;