import React, { useEffect, useState } from 'react';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './PageValidators.module.scss';
import { Link } from 'react-router-dom';
import { metEnFormeGrandNombre } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import { tblValidators } from '../../application/AppData';

const PageValidators = () => {

    // Variables React
    const [filtre, setFiltre] = useState();
    const [filteredTblValidators, setFilteredTblValidators] = useState();

    // Autres variables/constantes
    const nbActiveValidators = Object.values(tblValidators).filter(element => element.status === "active").length;
    const nbInactiveValidators = Object.values(tblValidators).filter(element => element.status !== "active").length;
    const nbValidators = Object.values(tblValidators).length;


    // Fonction de sélection de filtre
    const handleClickOnFilter = (val) => {
        // Valeur de "filtre" et statut associé :
            // 0 => active validators
            // 1 => inactive validators
            // 2 => all validators
        setFiltre(val);

        filtreValidateurs(val);
    }

    // Fonction de filtrage de liste validateurs
    const filtreValidateurs = (valFiltre) => {
        const filteredValidators = [];
        if(valFiltre === 0)
            filteredValidators.push(...Object.entries(tblValidators).filter(element => element[1].status === "active").sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}))
        if(valFiltre === 1)
            filteredValidators.push(...Object.entries(tblValidators).filter(element => element[1].status !== "active").sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}))
        if(valFiltre === 2)
            filteredValidators.push(...Object.entries(tblValidators).sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}))

        // Et renvoi du tableau filtré
        setFilteredTblValidators(filteredValidators);
    }

    // À exécuter au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Validators - ' + appName;

        // Chargement de liste des validateurs actifs, par défaut
        filtreValidateurs(0);
        setFiltre(0);

    }, [])


    return (
        <>
            <h1><span><CalculatorIcon /><strong>Validators</strong></span></h1>
            <br />
            <div className={styles.tblFilters}>
                <button className={filtre === 0 ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter(0)}><strong>Active</strong> ({nbActiveValidators})<br />↓</button>
                <button className={filtre === 1 ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter(1)}><strong>Inactive</strong> ({nbInactiveValidators})<br />↓</button>
                <button className={filtre === 2 ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter(2)}><strong>All</strong> ({nbValidators})<br />↓</button>
            </div>
            <table className={styles.tblValidators}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Com.</th>
                        <th>Staked</th>
                        <th>Voting power</th>
                    </tr>
                </thead>
                <tbody>
                {filteredTblValidators ?
                    filteredTblValidators.map((valeur, clef) => {
                    // if((filtre === 0 && valeur[1].status === "active") ||
                    //    (filtre === 1 && valeur[1].status !== "active") ||
                    //    (filtre === 2)
                    // )
                        return <tr key={clef}>
                            <td>{clef+1}</td>
                            <td><Link to={"/validators/" + valeur[0]}>{valeur[1].description_moniker}</Link></td>
                            <td>{valeur[1].commission_actual_pourcentage}%</td>
                            <td>{metEnFormeGrandNombre(valeur[1].voting_power_amount/1000000, 2)}</td>
                            <td><strong>{valeur[1].voting_power_pourcentage.toFixed(2)}%</strong></td>
                        </tr>
                    // else
                    //     return null;
                }) : null }
                </tbody>
            </table>
            <div className={styles.comments}>
                <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)
            </div>
        </>
    );
};

export default PageValidators;