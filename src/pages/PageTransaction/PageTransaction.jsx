import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExchangeIcon } from '../../application/AppIcons';
import styles from './PageTransaction.module.scss';
import BlockTxInfos from './BlockTxInfos';
import BlockTxMessages from './BlockTxMessages';
import { getTxDatas } from './getTxDatas';
import { appName } from '../../application/AppParams';

const PageTransaction = () => {

    // Récupération du hash de transaction, éventuellement passé en argument
    const { txHash } = useParams();

    // Variables React
    const [txDatas, setTxDatas] = useState([]);
    const [msgErreurTxDatas, setMsgErreurTxDatas] = useState();

    // Chargement au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Transaction #' + txHash + ' - ' + appName;

        // Récupération de la transaction ciblée
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
            {txDatas && txDatas['txInfos'] ?
                txDatas['txInfos']['datetime'] ?
                    <div>
                        <BlockTxInfos txInfos={txDatas['txInfos']} txHash={txHash} />
                        {txDatas['txMessages'].map((message, index) => {
                            return <BlockTxMessages txMessage={message} key={index} idxElement={index+1} nbElements={txDatas['txMessages'].length} txHash={txHash} />
                        })}
                    </div>
                    : null
                : msgErreurTxDatas ? <div className="boxContainer"><div className="erreur">{msgErreurTxDatas}</div></div>
                : <div className="boxContainer"><p>Loading data from blockchain (lcd) ...</p></div>
            }
        </>
    );
};

export default PageTransaction;