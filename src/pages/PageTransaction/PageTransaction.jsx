import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExchangeIcon } from '../../application/AppIcons';
import styles from './PageTransaction.module.scss';
import BlockTxInfos from './BlockTxInfos';
import BlockTxMessages from './BlockTxMessages';
import { getTxDatas } from './getTxDatas';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';
import JsonView from 'react18-json-view';

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
                        {txDatas['txInfos']['transferts'] && txDatas['txInfos']['transferts'].length > 0 ?
                            <StyledBox title="Transfers" color="purple">
                                <div className={styles.addContent}>
                                {txDatas['txInfos']['transferts'].map((valeur, index) => {
                                    return <div key={index}><Link to={"/accounts/" + valeur.sender}>{valeur.sender.substring(0, 6) + "..." + valeur.sender.substring(valeur.sender.length - 6, valeur.sender.length)}</Link>&nbsp;send&nbsp;<strong>{valeur.amount}</strong>&nbsp;to&nbsp;<Link to={"/accounts/" + valeur.recipient}>{valeur.recipient.substring(0, 6) + "..." + valeur.recipient.substring(valeur.recipient.length - 6, valeur.recipient.length)}</Link>{valeur.multiple_coins !== "" ? <span className="comment"><br/>({valeur.multiple_coins.replaceAll(",", ", ")})</span> : null}</div>
                                })}
                                </div>
                            </StyledBox>
                        : null}
                        {txDatas['txMessages'].map((message, index) => {
                            return <BlockTxMessages txMessage={message} key={index} idxElement={index+1} nbElements={txDatas['txMessages'].length} txHash={txHash} />
                        })}
                        {txDatas['txInfos']['logs'] ?
                            <StyledBox title="Logs" color="brown">
                                <div className={styles.addContent}>
                                    <JsonView src={txDatas['txInfos']['logs']} />
                                </div>
                            </StyledBox>
                        : null}
                    </div>
                    : null
                : msgErreurTxDatas ? <StyledBox title="ERROR" color="red"><span className='erreur'>{msgErreurTxDatas}</span></StyledBox>
                : <StyledBox title="Loading" color="blue">Loading data from blockchain (lcd), please wait ...</StyledBox>
            }
        </>
    );
};

export default PageTransaction;