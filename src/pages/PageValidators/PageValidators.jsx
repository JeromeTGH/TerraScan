import React, { useEffect } from 'react';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './PageValidators.module.scss';
import { Link } from 'react-router-dom';
import { metEnFormeGrandNombre } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import { tblValidators } from '../../application/AppData';

const PageValidators = () => {


    // À exécuter au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Validators - ' + appName;

    }, [])


    return (
        <>
            <h1><span><CalculatorIcon /><strong>Validators</strong></span></h1>
            <br />
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
                {Object.entries(tblValidators).sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}).map((valeur, clef) => {
                    if(valeur[1].status === "active")
                        return <tr key={clef}>
                            <td>{clef+1}</td>
                            <td><Link to={"/validators/" + valeur[0]}>{valeur[1].description_moniker}</Link></td>
                            <td>{valeur[1].commission_actual_pourcentage}%</td>
                            <td>{metEnFormeGrandNombre(valeur[1].voting_power_amount/1000000, 2)}</td>
                            <td><strong>{valeur[1].voting_power_pourcentage.toFixed(2)}%</strong></td>
                        </tr>
                    else
                        return null;
                })}
                </tbody>
            </table>
            <div className={styles.comments}>
                <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)
            </div>
        </>
    );
};

export default PageValidators;