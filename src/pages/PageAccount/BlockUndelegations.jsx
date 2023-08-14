import React, { useEffect, useState } from 'react';
import styles from './BlockUndelegations.module.scss';
import { DelegationIcon } from '../../application/AppIcons';
import { getUndelegationsAccount } from './getUndelegationsAccount';
import { formateLeNombre, metEnFormeDateTime } from '../../application/AppUtils';
import { Link } from 'react-router-dom';

const BlockUndelegations = (props) => {
    
    // Variables React
    const [tableOfUndelegations, setTableOfUndelegations] = useState();
    const [msgErreurGettingUndelegations, setMsgErreurGettingUndelegations] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getUndelegationsAccount(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setMsgErreurGettingUndelegations(res['erreur']);
                setTableOfUndelegations([]);
            }
            else {
                setMsgErreurGettingUndelegations('');
                setTableOfUndelegations(res);
            }
        })
    }, [props])

    // Affichage
    return (
        <div className={"boxContainer " + styles.delegationsBlock}>
            <h2><DelegationIcon /><span>Undelegations</span></h2>
            <table className={styles.tblDelegations}>
                <thead>
                    <tr>
                        <th>Validator</th>
                        <th>Amount of unbonded LUNC</th>
                        <th>%</th>
                        <th>Release date/time</th>
                    </tr>
                </thead>
                {tableOfUndelegations ? 
                        tableOfUndelegations.length > 0 ? (
                            <tbody>
                                {tableOfUndelegations.map((valeur, clef) => {
                                    return <tr key={clef}>
                                        <td><Link to={"/validators/" + valeur[0]}>{valeur[1]}</Link></td>
                                        <td>
                                            <strong>{formateLeNombre(parseInt(valeur[3]), "\u00a0")}</strong>
                                            <span className={styles.smallPart}>{"," + (valeur[3]%1).toFixed(6).replace('0.', '')}</span>
                                        </td>
                                        <td><span className={styles.percentage}>{valeur[4] + "\u00a0%"}</span></td>
                                        <td><span className={styles.percentage}>{metEnFormeDateTime(valeur[5])}</span></td>
                                    </tr>
                                })}
                            </tbody>
                        ) : (
                            <tbody><tr><td colSpan="5">No undelegation.</td></tr></tbody>
                        )
                    : (
                        <tbody><tr><td colSpan="5">Loading data from blockchain (lcd) ...</td></tr></tbody>
                    )}
            </table>
            <br />
            <div className="erreur">{msgErreurGettingUndelegations}</div>
        </div>
    );
};

export default BlockUndelegations;