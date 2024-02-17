import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExchangeIcon } from '../../application/AppIcons';
import styles from './PageTransaction.module.scss';
import BlockTxInfos from './BlockTxInfos';
import BlockTxMessages from './BlockTxMessages';
import { getTxDatas } from './getTxDatas';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';
import ObjectViewer from '../../sharedComponents/ObjectViewer';

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
            {txDatas && txDatas['txInfos'] ?
                txDatas['txInfos']['datetime'] ?
                    <div>
                        <BlockTxInfos txInfos={txDatas['txInfos']} txHash={txHash} />
                        <StyledBox title="Memo" color="blue">
                            <span className={styles.memo}>{txDatas['txInfos']['memo']}</span>
                        </StyledBox>
                        {txDatas['txMessages'].map((message, index) => {
                            return <BlockTxMessages txMessage={message} key={index} idxElement={index+1} nbElements={txDatas['txMessages'].length} txHash={txHash} />
                        })}
                        <StyledBox title="Logs" color="purple">
                            <ObjectViewer objetAvisualiser={txDatas['txInfos']['logs']} className={styles.logs} nomChamp='logs' />
                        </StyledBox>
                    </div>
                    : null
                : msgErreurTxDatas ? <StyledBox title="ERROR" color="red"><span className='erreur'>{msgErreurTxDatas}</span></StyledBox>
                : <StyledBox title="Loading" color="blue">Loading data from blockchain (lcd), please wait ...</StyledBox>
            }
        </>
    );
};

export default PageTransaction;