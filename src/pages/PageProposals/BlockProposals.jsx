import React, { useEffect, useState } from 'react';
import styles from './BlockProposals.module.scss';

const BlockProposals = () => {

    // Variables React
    const [filtre, setFiltre] = useState(0);

    // Fonction de sélection de filtre
    const handleClick = (val) => {
        setFiltre(val);
    }

    // Exécution au chargement de la page, et à chaque changement de filtre
    useEffect(() => {
        console.log("Filtre = " + filtre);
    }, [filtre])

    // Affichage
    return (
        <div className={styles.blockProposals}>
            <table className={styles.tblFilters}>
                <tbody>
                    <tr>
                        <td className={filtre === 0 ? styles.selectedFilter : null} onClick={() => handleClick(0)}>Show all proposals<br />↓</td>
                        <td className={filtre === 1 ? styles.selectedFilter : null} onClick={() => handleClick(1)}>Show votes in progress<br />↓</td>
                        <td className={filtre === 2 ? styles.selectedFilter : null} onClick={() => handleClick(2)}>Show pending deposits<br />↓</td>
                        <td className={filtre === 3 ? styles.selectedFilter : null} onClick={() => handleClick(3)}>Show adopted proposals<br />↓</td>
                        <td className={filtre === 4 ? styles.selectedFilter : null} onClick={() => handleClick(4)}>Show rejected proposals<br />↓</td>
                    </tr>
                </tbody>
            </table>
            <div className="boxContainer">
                Proposals blocks ...
            </div>
        </div>
    );
};

export default BlockProposals;