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
            <div className={styles.message}>
                {props.message && props.message[0] ? <p><strong>ERROR</strong> : {props.message[0]}</p> : null}
                {props.message && props.message[1] ? <p>{props.message[1]}</p> : null}
            </div>
        </div>
    );
};

export default LoadingAnim;