import React, { useEffect, useState } from 'react';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './BlockValidators.module.scss';
import { getValidators } from '../../sharedFunctions/getValidators';
import { Link } from 'react-router-dom';
import { metEnFormeGrandNombre } from '../../application/AppUtils';

const BlockValidators = () => {

    // Variables react
    const [ tblOfValidators, setTblOfValidators ] = useState();
    const [ msgErreurGetValidators, setMsgErreurGetValidators ] = useState();

    // À exécuter au démarrage
    useEffect(() => {
        getValidators().then((res) => {
            if(res['erreur']) {
                setTblOfValidators();
                setMsgErreurGetValidators(res['erreur']);
            }
            else {
                setTblOfValidators(res);
                setMsgErreurGetValidators('');
            }
        });
    }, [])

    // Affichage
    return (
        <>
            <h2><strong><CalculatorIcon /></strong><span><strong>Validators</strong> (actives)</span></h2>
            <div className={styles.tblValidators}>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom</th>
                            <th>Comm.</th>
                            <th>Delegator shares</th>
                            <th>Voting power</th>
                        </tr>
                    </thead>
                    {tblOfValidators ? (
                    <tbody>
                        {tblOfValidators.map((valeur, clef) => {
                            return <tr className={styles.coinMajeur} key={clef}>
                                <td>{clef+1}</td>
                                <td><Link to={"/validators/" + valeur[1]}>{valeur[0]}</Link></td>
                                <td>{valeur[2]}%</td>
                                <td>{metEnFormeGrandNombre(valeur[3], 3)}</td>
                                {/* \u00A0 = espace insécable */}
                                <td><strong>{valeur[4]}%</strong></td>
                            </tr>
                        })}
                    </tbody>
                    ) : (
                        <tbody><tr><td colSpan="5">Loading data from blockchain ...</td></tr></tbody>
                    )}
                </table>
            </div>
            <div className={styles.comments}>
                <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)
            </div>
            <div className="erreur">{msgErreurGetValidators}</div>
        </>
    );
};

export default BlockValidators;