import React, { useEffect, useState } from 'react';
import styles from './BlockOtherAssets.module.scss';
import { StackedCoinsIcon } from '../../application/AppIcons';
import { getOtherAssets } from '../../sharedFunctions/getOtherAssets';

const BlockOtherAssets = (props) => {

    // Variables react
    const [ tblOfAssets, setTblOfAssets ] = useState();
    const [ msgErreurTblOfAssets, setMsgErreurTblOfAssets ] = useState();

    // À exécuter au démarrage
    useEffect(() => {
        getOtherAssets(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setTblOfAssets();
                setMsgErreurTblOfAssets(res['erreur']);
            }
            else {
                setTblOfAssets(res);
                setMsgErreurTblOfAssets('');
            }
        });
    }, [props])

    // Affichage    
    return (
        <>
            <div className={"boxContainer " + styles.otherAssetsBlock}>
                <h2><strong><StackedCoinsIcon /></strong><span>Other assets</span></h2>
                <table className={styles.tblAssets}>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Available in&nbsp;account</th>
                            <th>Pending rewards</th>
                        </tr>
                    </thead>
                    {tblOfAssets ? 
                        tblOfAssets.length > 0 ? (
                            <tbody>
                                {tblOfAssets.map((valeur, clef) => {
                                    return <tr key={clef}>
                                        <td>{valeur[0]}</td>
                                        <td>{valeur[1]}</td>
                                        <td>{valeur[2]}</td>
                                    </tr>
                                })}
                            </tbody>
                        ) : (
                            <tbody><tr><td colSpan="3">No asset.</td></tr></tbody>
                        )
                    : (
                        <tbody><tr><td colSpan="3">Loading data from blockchain ...</td></tr></tbody>
                    )}
                </table>
                <div className="erreur">{msgErreurTblOfAssets}</div>
                <div className={styles.comments}>
                    <u>Note</u> : only terra classic "native tokens" are shown here
                </div>
            </div>
        </>
    );
};

export default BlockOtherAssets;