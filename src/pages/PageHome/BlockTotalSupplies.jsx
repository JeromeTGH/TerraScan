import React, { useEffect, useState } from 'react';
import { Stack1Icon } from '../../application/AppIcons';
import styles from './BlockTotalSupplies.module.scss';
import { getTotalSupplies } from '../../sharedFunctions/getTotalSupplies';

const BlockTotalSupplies = () => {

    // Variables react
    const [coinsTotalSupply, setCoinsTotalSupply] = useState();
    const [ msgErreurGetTotalSupplies, setMsgErreurGetTotalSupplies ] = useState();

    // À exécuter au démarrage
    useEffect(() => {
        getTotalSupplies().then((res) => {
            if(res['erreur']) {
                setCoinsTotalSupply();
                setMsgErreurGetTotalSupplies(res['erreur']);
            }
            else {
                setCoinsTotalSupply(res);
                setMsgErreurGetTotalSupplies('');
            }
        });
    }, [])

    // Affichage
    return (
        <>
            <h2><strong><Stack1Icon /></strong><span><strong>Total Supplies</strong> (latest)</span></h2>
            <table className={styles.tblTotalSupplies}>
                    {coinsTotalSupply ? (
                    <tbody>
                        {coinsTotalSupply[0] ? coinsTotalSupply[0].map((valeur, clef) => {
                            return <tr className={styles.coinMajeur} key={clef}>
                                <td>{valeur[0]}</td>
                                <td>{valeur[1]}</td>
                            </tr>
                        }) : <tr><td colSpan="2">No major coin ?!</td></tr>}
                        {coinsTotalSupply[1] ? coinsTotalSupply[1].map((valeur, clef) => {
                            return <tr className={styles.coinMineur} key={clef}>
                                <td>{valeur[0]}</td>
                                <td>{valeur[1]}</td>
                            </tr>
                        }) : <tr><td colSpan="2">No minor coin ?!</td></tr>}
                    </tbody>
                    ) : (
                        <tbody><tr><td colSpan="2">Loading data from blockchain ...</td></tr></tbody>
                    )}
            </table>
            <div className="erreur">{msgErreurGetTotalSupplies}</div>
        </>
    );
};

export default BlockTotalSupplies;