import React, { useEffect, useState } from 'react';
import styles from './BlockDelegations.module.scss';
import { DelegationIcon } from '../../application/AppIcons';
import { getDelegationsAccount } from '../../sharedFunctions/getDelegationsAccount';
import { formateLeNombre } from '../../application/AppUtils';
import { Link } from 'react-router-dom';

const BlockDelegations = (props) => {
    
    // Variables React
    const [tableOfDelegations, setTableOfDelegations] = useState();
    const [msgErreurGettingDelegations, setMsgErreurGettingDelegations] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getDelegationsAccount(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setMsgErreurGettingDelegations(res['erreur']);
                setTableOfDelegations([]);
            }
            else {
                setMsgErreurGettingDelegations('');
                setTableOfDelegations(res);
            }
        })
    }, [props])

    // Affichage
    return (
        <div className={"boxContainer " + styles.delegationsBlock}>
            <h2><DelegationIcon /><span>Delegations</span></h2>
            <table className={styles.tblDelegations}>
                <thead>
                    <tr>
                        <th>Validator</th>
                        <th>Status</th>
                        <th>Amount of staked LUNC</th>
                        <th>%</th>
                    </tr>
                </thead>
                {tableOfDelegations ? 
                        tableOfDelegations.length > 0 ? (
                            <tbody>
                                {tableOfDelegations.map((valeur, clef) => {
                                    return <tr key={clef}>
                                        <td><Link to={"/validators/" + valeur[0]}>{valeur[1]}</Link></td>
                                        <td className={valeur[2] === "Jailed" ? "erreur" : "succes"}>{valeur[2]}</td>
                                        <td>
                                            <strong>{formateLeNombre(parseInt(valeur[3]), "\u00a0")}</strong>
                                            <span className={styles.smallPart}>{"," + (valeur[3]%1).toFixed(6).replace('0.', '')}</span>
                                        </td>
                                        <td><span className={styles.percentage}>{valeur[4] + "\u00a0%"}</span></td>
                                    </tr>
                                })}
                            </tbody>
                        ) : (
                            <tbody><tr><td colSpan="4">No delegation.</td></tr></tbody>
                        )
                    : (
                        <tbody><tr><td colSpan="4">Loading data from blockchain ...</td></tr></tbody>
                    )}
            </table>
            <br />
            <div className="erreur">{msgErreurGettingDelegations}</div>
        </div>
    );
};

export default BlockDelegations;