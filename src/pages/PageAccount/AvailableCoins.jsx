import React, { useEffect, useState } from 'react';
import styles from './AvailableCoins.module.scss';
import { getAvailableCoins } from './getAvailableCoins';


const AvailableCoins = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblCoins, setTblCoins] = useState();
    const [msgErreur, setMsgErreur] = useState();

    const [isMinorCoinsVisible, setIsMinorCoinsVisible] = useState(false);

    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {

        setIsLoading(true);

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


    // HandleClick pour l'expansion/rétrécissement de l'affichage des "minor coins"
    const handleClickShowHide = () => {
        setIsMinorCoinsVisible(!isMinorCoinsVisible);
    }


    // Affichage
    return (
        <>
            <br />
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
                :
                isLoading ?
                    <div>Loading data from blockchain (lcd), please wait ...</div>
                :
                    <>
                        <div className={styles.container}>
                            <div className={styles.available}>
                                <div className={styles.titreAvailable}>
                                    <div className={styles.texteAvailable}>Available</div>
                                </div>
                                <div><u>Available coins (not staked) :</u></div>
                                <div className={isMinorCoinsVisible ? styles.containerEtendu : styles.containerRestreint}>
                                    <div className={styles.coin}>
                                        <div className={styles.coinImageAndLabel}>
                                            <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                            <span><strong>LUNC</strong></span>
                                        </div>
                                        <div className={styles.coinValue}><strong>{tblCoins[0][0]}</strong></div>
                                    </div>
                                    <div className={styles.coin}>
                                        <div className={styles.coinImageAndLabel}>
                                            <img src={'/images/coins/USTC.png'} alt='USTC logo' />
                                            <span><strong>USTC</strong></span>
                                        </div>
                                        <div className={styles.coinValue}><strong>{tblCoins[1][0]}</strong></div>
                                    </div>
                                    {isMinorCoinsVisible ? tblCoins.map((element, index) => {
                                        return (index > 1) ? <div key={index} className={styles.coin}>
                                            <div className={styles.coinImageAndLabel}>
                                                <img src={'/images/coins/' + element[1] + '.png'} alt={element[1] + ' logo'} />
                                                <span>{element[1]}</span>
                                            </div>
                                            <div className={styles.coinValue}>{element[0]}</div>
                                        </div> : null
                                    }) : null}
                                    <div className={styles.otherCoins}>
                                        <span onClick={() => handleClickShowHide()}>{isMinorCoinsVisible ? "«" : "..."}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};

export default AvailableCoins;