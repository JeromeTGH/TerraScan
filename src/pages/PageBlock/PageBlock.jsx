import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AccountIcon, BlocksIcon, ExchangeIcon, EyeIcon, TimeIcon } from '../../application/AppIcons';
import styles from './PageBlock.module.scss';
import { appName, tblCorrespondanceMessages } from '../../application/AppParams';
import { tblBlocks } from '../../application/AppData';
import { metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import StyledBox from '../../sharedComponents/StyledBox';
import { getBlockInfos } from './getBlockInfos';


const PageBlock = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { blockNum } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    // Variables react
    const [ loadingOrNot, setLoadingOrNot ] = useState(true);
    const [ msgErreurGetBlock, setMsgErreurGetBlock ] = useState();

    // Changement du "title" de la page web
    useEffect(() => {
        document.title = 'Block #' + blockNum + ' - ' + appName;

        // Récupération des infos concernant ce block
        setLoadingOrNot(true);
        getBlockInfos(blockNum).then((res) => {
            if(res['erreur']) {
                setMsgErreurGetBlock(res['erreur']);
            }
            else {
                setLoadingOrNot(false);
                setMsgErreurGetBlock('');
            }
        });

    }, [blockNum])

    return (
        <>
            <h1><span><BlocksIcon /><strong>Block</strong> #{blockNum}</span></h1>
            {msgErreurGetBlock ?
                <StyledBox title="ERROR" color="red"><span className='erreur'>{msgErreurGetBlock}</span></StyledBox>
            :
            <>
                <StyledBox title="Block infos" color="green">
                    {loadingOrNot ?
                        <div>Loading data from blockchain (fcd), please wait ...</div>
                    :
                        <div className={styles.blockInfos}>
                            <div className={styles.blockDatetime}>
                                <div className={styles.blockTitle}><TimeIcon />&nbsp;Date&nbsp;&&nbsp;Time</div>
                                <div className={styles.blockValue}>{metEnFormeDateTime(tblBlocks[blockNum].datetime)}</div>
                            </div>
                            <div className={styles.blockProposer}>
                                <div className={styles.blockTitle}><AccountIcon />&nbsp;Proposer</div>
                                <div className={styles.blockValue}><Link to={"/validators/" + tblBlocks[blockNum].validator_address}>{tblBlocks[blockNum].validator_moniker}</Link></div>
                            </div>
                            <div className={styles.blockNbTxs}>
                                <div className={styles.blockTitle}><ExchangeIcon />&nbsp;Nb&nbsp;Txs</div>
                                <div className={styles.blockValue}>{tblBlocks[blockNum].nb_tx}&nbsp;Txs</div>
                            </div>
                        </div>
                    }
                </StyledBox>
                <StyledBox title="Transactions" color="blue">
                    {tblBlocks && tblBlocks[blockNum] && tblBlocks[blockNum].txs ? 
                        <div className={styles.blockTransactions}>
                            <table className={styles.tblTransactions}>
                                <thead>
                                    <tr>
                                        <th>Date/Time</th>
                                        <th>Operation</th>
                                        <th>Amount</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tblBlocks[blockNum].txs.map((element, index) => {
                                        return <tr key={index}>
                                            <td>{metEnFormeDateTime(element.datetime)}</td>
                                            <td>
                                                {tblCorrespondanceMessages[element.msgType] ? tblCorrespondanceMessages[element.msgType] : element.msgType}
                                                {element.errorCode !== 0 ? <> <span className='failed'>FAILED</span></> : null}
                                            </td>
                                            <td className={styles.amounts}>
                                                {element.amount ? 
                                                    <>
                                                        <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.amount)}</span>
                                                        <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.amount)}</span>
                                                        {element.unit.includes('ibc') ? <span className={styles.ibc}>{element.unit}</span> : <img src={'/images/coins/' + element.unit + '.png'} alt={element.unit + ' logo'} />}
                                                    </>
                                                :
                                                    <>&nbsp;</>
                                                }
                                            </td>
                                            <td className={styles.view}><Link to={'/transactions/' + element.txHash}><EyeIcon /></Link></td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    :
                        <p>Loading data from blockchain (fcd), please wait ...</p>
                    }
                </StyledBox>
            </>
            }
        </>
    );
};

export default PageBlock;