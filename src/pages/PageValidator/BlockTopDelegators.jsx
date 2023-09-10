import React, { useEffect, useState } from 'react';
import styles from './BlockTopDelegators.module.scss';
import { getValDelegators } from './getValDelegators';
import { Link } from 'react-router-dom';
import { formateLeNombre } from '../../application/AppUtils';
import StyledBox from '../../sharedComponents/StyledBox';


const BlockTopDelegators = (props) => {

    // Variables react
    const [ tblOfTopDelegators, setTblOfTopDelegators ] = useState();
    const [ msgErreurTblOfTopDelegators, setMsgErreurTblOfTopDelegators ] = useState();

    // À exécuter au démarrage
    useEffect(() => {
        getValDelegators(props.valAddress).then((res) => {
            if(res['erreur']) {
                setTblOfTopDelegators();
                setMsgErreurTblOfTopDelegators(res['erreur']);
            }
            else {
                setTblOfTopDelegators(res);
                setMsgErreurTblOfTopDelegators('');
            }
        });
    }, [props])

    // Affichage    
    return (
        <>
            <StyledBox title="Top delegators (stakers)" color="purple" className={styles.otherTopDelegatorsBlock}>
                {msgErreurTblOfTopDelegators ? 
                    <div className="erreur">{msgErreurTblOfTopDelegators}</div>
                :
                    tblOfTopDelegators ? 
                        tblOfTopDelegators.length > 0 ? (
                            <table className={styles.tblTopDelegators}>
                            <thead>
                                <tr>
                                    <th>Staker address</th>
                                    <th>Nb&nbsp;LUNC</th>
                                    <th>%</th>
                                </tr>
                            </thead>
                                    <tbody>
                                {tblOfTopDelegators.map((valeur, clef) => {
                                    return <tr key={clef}>
                                        <td><Link to={"/accounts/" + valeur[0]}>{valeur[0]}</Link></td>
                                        <td>
                                            {formateLeNombre(parseInt(valeur[1]), " ")},
                                            <span className={styles.smallPart}>{(valeur[1]%1).toFixed(6).replace('0.', '')}</span>
                                        </td>
                                        <td>{valeur[2]}</td>
                                    </tr>
                                })}
                            </tbody>
                            </table>
                        ) : (
                            <p>No delegator.</p>
                        )
                    : (
                        <p>Loading data from blockchain (lcd), please wait ...</p>
                    )
                }
                {tblOfTopDelegators ?
                    <div className={styles.comments}>
                        <u>Note</u> : only a maximum of {tblOfTopDelegators.length} delegators are presented here
                    </div>
                : null}
            </StyledBox>
        </>
    );
};


export default BlockTopDelegators;