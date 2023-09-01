import React from 'react';
import styles from './LoadingAnim.module.scss';

const LoadingAnim = () => {

    // Texte à afficher
    const texteAafficher = 'TerraScan - A scanner for Terra Classic blockchain - ';

    // Affichage
    return (
        <div className={styles.animContainer}>
            <div className={styles.cercle}>
                <div className={styles.logo}></div>
                <div className={styles.texte}>
                    <p>{texteAafficher.split('').map((element, index) => {
                        return <span style={{transform: 'rotate(' + (index*6.85) + 'deg)'}}>{element}</span>
                    })}</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingAnim;