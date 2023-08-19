import React, { useEffect, useState } from 'react';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './BlockValidatorsV2.module.scss';
import { loadValidatorsList } from '../../sharedFunctions/getValidatorsV2';
import { Link } from 'react-router-dom';
import { metEnFormeGrandNombre } from '../../application/AppUtils';
import { tblValidators } from '../../application/AppData';

const BlockValidatorsV2 = () => {

    // Variables react
    const [ loadingOrNot, setLoadingOrNot ] = useState(true);
    const [ msgErreurGetValidators, setMsgErreurGetValidators ] = useState();

    // À exécuter au démarrage
    useEffect(() => {
        setLoadingOrNot(true);

        loadValidatorsList().then((res) => {
            if(res['erreur']) {
                setMsgErreurGetValidators(res['erreur']);
            }
            else {
                setLoadingOrNot(false);
                setMsgErreurGetValidators('');
            }
        });
    }, [])

    // Affichage
    return (
        <>
            <h2><strong><CalculatorIcon /></strong><span><strong>Validators</strong> (actives)</span></h2>
            {msgErreurGetValidators ?
                <div className="erreur">{msgErreurGetValidators}</div>
            :
                <>
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
                        {loadingOrNot ?
                            <tr><td colSpan="5">Loading data from blockchain (fcd), please wait ...</td></tr>
                        :   
                            Object.entries(tblValidators).sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}).map((valeur, clef) => {
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
                            })
                        }
                        </tbody>
                    </table>
                    <div className={styles.comments}>
                        <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)
                    </div>
                </>
            }
        </>
    );
};

export default BlockValidatorsV2;