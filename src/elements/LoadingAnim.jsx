import React from 'react';
import styles from './LoadingAnim.module.scss';

const LoadingAnim = (props) => {

    // Texte à afficher
    const texteAafficher = 'TerraScan - A scanner for Terra Classic blockchain - ';

    // Affichage
    return (
        <div className={styles.animContainer}>
            <div className={styles.cercle}>
                <div className={styles.logo}></div>
                <div className={props.anim ? styles.texteAnimON : styles.texteAnimOFF}>
                    <p>{texteAafficher.split('').map((element, index) => {
                        return <span key={index} style={{transform: 'rotate(' + (index*6.85) + 'deg)'}}>{element}</span>
                    })}</p>
                </div>
            </div>
            <div className={styles.isError}>
                <div className={styles.mainTextError}>{props.isError ? <strong>ERROR : failed to load datas from Terra&nbsp;Classic&nbsp;blockchain</strong> : <strong>Loading datas from blockchain, please&nbsp;wait...</strong>}</div>
                <div className={styles.subTextError}>{props.isError ? <>There is a network issue, or a chain upgrade.<br /><u>Just wait, then retry a bit later</u> ! Thanks ;)</> : <>If nothing appears, it could be a network&nbsp;issue or a chain upgrade.<br />In these cases, just try again a bit later&nbsp;! Thanks ;)</>}</div>
            </div>
        </div>
    );
};

export default LoadingAnim;