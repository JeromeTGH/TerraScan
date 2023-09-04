import React, { useState } from 'react';
import styles from './StakedLunc.module.scss';
import { DelegationIcon } from '../../application/AppIcons';

const StakedLunc = () => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblCoins, setTblCoins] = useState();
    const [msgErreur, setMsgErreur] = useState();


    // Affichage
    return (
        <>
            <h2 className={styles.h2title}><strong><DelegationIcon />Delegations</strong>&nbsp;(staking)</h2>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
                :
                isLoading ?
                    <div>Loading data from blockchain (lcd), please wait ...</div>
                :
                    <>
                        {/* <div className={styles.container}>
                            <div className={styles.coin}>
                                <div className={styles.coinImageAndLabel}>
                                    <img src={'/images/coins/LUNC.png'} alt='' />
                                    <span><strong>LUNC</strong></span>
                                </div>
                                <div className={styles.coinValue}><strong>{tblCoins[0][0]}</strong></div>
                            </div>
                            <div className={styles.coin}>
                                <div className={styles.coinImageAndLabel}>
                                    <img src={'/images/coins/USTC.png'} alt='' />
                                    <span><strong>USTC</strong></span>
                                </div>
                                <div className={styles.coinValue}><strong>{tblCoins[1][0]}</strong></div>
                            </div>
                            {isMinorCoinsVisible ? tblCoins.map((element, index) => {
                                return (index > 1) ? <div key={index} className={styles.coin}>
                                    <div className={styles.coinImageAndLabel}>
                                        <img src={'/images/coins/' + element[1] + '.png'} alt='' />
                                        <span>{element[1]}</span>
                                    </div>
                                    <div className={styles.coinValue}>{element[0]}</div>
                                </div> : null
                            }) : null}
                            <div className={styles.otherCoins}>
                                <span onClick={() => handleClickShowHide()}>{isMinorCoinsVisible ? "«" : "..."}</span>
                            </div>
                        </div> */}
                    </>
            }
        </>
    );
};

export default StakedLunc;