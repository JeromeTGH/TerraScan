import React, { useEffect, useState } from 'react';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './BlockValidators.module.scss';
import { Link } from 'react-router-dom';
import { metEnFormeGrandNombre } from '../../application/AppUtils';
import { tblValidators } from '../../application/AppData';

const BlockValidatorsV2 = () => {

    // Variables react
    const [ validatorsListPagination, setValidatorsListPagination ] = useState(0);

    // Autres variables/constantes
    const nbElementsParPagination = 15;

    // Fonction de sélection de page, pour la liste des validateurs
    const handleClickValidatorsList = (val) => {
        setValidatorsListPagination(val);
    }


    // À exécuter au démarrage
    useEffect(() => {
        setValidatorsListPagination(0);
    }, [])

    // Affichage
    return (
        <div className={"boxContainer " + styles.validatorsBlock}>
            <h2><strong><CalculatorIcon /></strong><span><strong>Validators</strong> (actives)</span></h2>
            <div className={styles.comments}>
                <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)
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
                {Object.entries(tblValidators).filter(element => element[1].status === "active").sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}).slice(validatorsListPagination*nbElementsParPagination, validatorsListPagination*nbElementsParPagination + nbElementsParPagination).map((valeur, clef) => {
                        return <tr key={clef}>
                            <td>{clef+1 + validatorsListPagination*nbElementsParPagination}</td>
                            <td><Link to={"/validators/" + valeur[0]}>{valeur[1].description_moniker}</Link></td>
                            <td>{valeur[1].commission_actual_pourcentage}%</td>
                            <td>{metEnFormeGrandNombre(valeur[1].voting_power_amount/1000000, 2)}</td>
                            <td><strong>{valeur[1].voting_power_pourcentage.toFixed(2)}%</strong></td>
                        </tr>
                    })
                }
                </tbody>
            </table>
            <div className='pagination'>
                <span>Page :</span>
                {Array(parseInt(Object.entries(tblValidators).filter(element => element[1].status === "active").length/nbElementsParPagination) + ((Object.entries(tblValidators).filter(element => element[1].status === "active").length/nbElementsParPagination)%1 > 0 ? 1 : 0)).fill(1).map((el, i) =>
                    <span key={i} className={i === validatorsListPagination ? 'paginationPageSelected' : 'paginationPageUnselected'} onClick={() => handleClickValidatorsList(i)}>{i+1}</span>
                )}
            </div>
        </div>
    );
};

export default BlockValidatorsV2;