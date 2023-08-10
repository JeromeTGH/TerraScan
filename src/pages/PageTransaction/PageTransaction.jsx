import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExchangeIcon } from '../../application/AppIcons';
import styles from './PageTransaction.module.scss';
import BlockTxInfos from './BlockTxInfos';
import BlockTxMessages from './BlockTxMessages';
import { getTxDatas } from './getTxDatas';

const PageTransaction = () => {

    // Récupération du hash de transaction, éventuellement passé en argument
    const { txHash } = useParams();

    // Variables React
    const [txDatas, setTxDatas] = useState([]);
    const [msgErreurTxDatas, setMsgErreurTxDatas] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getTxDatas(txHash).then((res) => {
            if(res['erreur']) {
                setMsgErreurTxDatas(res['erreur']);
                setTxDatas({});
            }
            else {
                setMsgErreurTxDatas('');
                setTxDatas(res);
            }
        })
    }, [txHash])

    // Affichages
    return (
        <>
            <h1><span><ExchangeIcon /><strong>Transaction</strong></span></h1>
            <p className={styles.txHash}>→ TxHash : <strong>{txHash}</strong></p>
            <br />
            {txDatas ?
                txDatas['txMessages'] ?
                    <div>
                        <BlockTxInfos txInfos={txDatas['txInfos']} txHash={txHash} />
                        {txDatas['txMessages'].map((message, index) => {
                            return <BlockTxMessages txMessage={message} key={index} idxElement={index+1} nbElements={txDatas['txMessages'].length} txHash={txHash} />
                        })}
                    </div>
                    : null
                : <p>Loading data from blockchain ...</p>
            }
            <div className="erreur">{msgErreurTxDatas}</div>
        </>
    );
};

export default PageTransaction;