import React, { useEffect, useState } from 'react';
import styles from './BlockValDetails.module.scss';
import { getValDetails } from './getValDetails';
import { CalculatorIcon } from '../../application/AppIcons';
import { formateLeNombre } from '../../application/AppUtils';
import { Link } from 'react-router-dom';


const BlockValDetails = (props) => {
    
    // Variables React
    const [tableValDetails, setTableValDetails] = useState();
    const [msgErreurTableValDetails, setMsgErreurTableValDetails] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getValDetails(props.valAddress).then((res) => {
            if(res['erreur']) {
                setMsgErreurTableValDetails(res['erreur']);
                setTableValDetails({});
            }
            else {
                setMsgErreurTableValDetails('');
                setTableValDetails(res);
            }
        })
    }, [props])

    // Affichage
    return (
        <div className={"boxContainer " + styles.detailsBlock}>
            <h2><strong><CalculatorIcon /></strong><span>Summary</span></h2>
            {tableValDetails ? 
                tableValDetails['actual_commission_rate'] ? 
                <table className={styles.tblDetails}>
                    <tbody>
                        <tr>
                            <td>Actual commission rate :</td>
                            <td>{tableValDetails['actual_commission_rate']}%</td>
                        </tr>
                        <tr>
                            <td>Voting power :</td>
                            <td>{tableValDetails['pourcentage_voting_power']}%</td>
                        </tr>
                        <tr>
                            <td>Nb of stakers (delegators) :</td>
                            <td>{tableValDetails['nb_delegators']}</td>
                        </tr>
                        <tr><td colSpan='2'>&nbsp;</td></tr>
                        <tr>
                            <td>Nb LUNC staked :</td>
                            <td>
                                {formateLeNombre(parseInt(tableValDetails['nb_lunc_staked']), " ")},
                                <span className={styles.smallPart}>{(tableValDetails['nb_lunc_staked']%1).toFixed(6).replace('0.', '')}</span>
                                <span> LUNC</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Nb LUNC self-bonded :</td>
                            <td>
                                {formateLeNombre(parseInt(tableValDetails['nb_lunc_self_bonded']), " ")},
                                <span className={styles.smallPart}>{(tableValDetails['nb_lunc_self_bonded']%1).toFixed(6).replace('0.', '')}</span>
                                <span> LUNC</span>
                            </td>
                        </tr>
                        <tr>
                            <td>% of self-bonded LUNC :</td>
                            <td>{tableValDetails['pourcentage_self_bonding']}%</td>
                        </tr>
                        <tr><td colSpan='2'>&nbsp;</td></tr>
                        <tr>
                            <td>Max commission rate :</td>
                            <td>{tableValDetails['max_commission_rate']}%</td>
                        </tr>
                        <tr>
                            <td>Max change per day (com.) :</td>
                            <td>{tableValDetails['max_change_commission_rate']}%</td>
                        </tr>


                        <tr><td colSpan='2'>&nbsp;</td></tr>
                        <tr>
                            <td>Operator address :</td>
                            <td>{props.valAddress}</td>
                        </tr>
                        <tr>
                            <td>Account address :</td>
                            <td><Link to={"/accounts/" + tableValDetails['adresse_compte_validateur']}>{tableValDetails['adresse_compte_validateur']}</Link></td>
                        </tr>
                    </tbody>
                </table>
                : null
                : <p>Loading data from blockchain ...</p>
            }
            <div className="erreur">{msgErreurTableValDetails}</div>
        </div>
    );
};

export default BlockValDetails;