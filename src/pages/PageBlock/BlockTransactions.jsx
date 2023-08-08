import React, { useEffect, useState } from 'react';
import styles from './BlockTransactions.module.scss';
import { getTransactions } from './getTransactions';
import { Link } from 'react-router-dom';

const BlockTransactions = (props) => {

    // Variables React
    const [tableBlockTransactions, setTableBlockTransactions] = useState();
    const [msgErreurTableBlockTransactions, setMsgErreurTableBlockTransactions] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getTransactions(props.blockNumber).then((res) => {
            if(res['erreur']) {
                setMsgErreurTableBlockTransactions(res['erreur']);
                setTableBlockTransactions({});
            }
            else {
                setMsgErreurTableBlockTransactions('');
                setTableBlockTransactions(res);
            }
        })
    }, [props])
    
    return (
        <div className={"boxContainer " + styles.transactionsBlock}>
            {tableBlockTransactions ? 
                tableBlockTransactions.length > 0 ? 
                    <table className={styles.tblTransactions}>
                    <thead>
                        <tr>
                            <th>Tx Hash</th>
                            <th>Tx Type</th>
                        </tr>
                    </thead>
                            <tbody>
                        {tableBlockTransactions.map((valeur, clef) => {
                            return <tr key={clef}>
                                <td><Link to={"/transactions/" + valeur[0]}>{valeur[0]}</Link></td>
                                <td>{valeur[2]}</td>
                            </tr>
                        })}
                    </tbody>
                    </table>
                : <p>No transaction.</p>
                : <p>Loading data from blockchain ...</p>
            }
            <div className="erreur">{msgErreurTableBlockTransactions}</div>
        </div>
    );
};

export default BlockTransactions;