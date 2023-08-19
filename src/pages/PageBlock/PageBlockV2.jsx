import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlocksIcon, ExchangeIcon } from '../../application/AppIcons';
import styles from './PageBlockV2.module.scss';
// import BlockDetail from './BlockDetail';
// import BlockTransactions from './BlockTransactions';
import { appName } from '../../application/AppParams';
import { getBlockInfoV2 } from './getBlockInfoV2';
import { tblBlocks } from '../../application/AppData';
import { isValidTerraAddressFormat, metEnFormeDateTime } from '../../application/AppUtils';

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
        getBlockInfoV2(blockNum).then((res) => {
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
            <br />
            
            {msgErreurGetBlock ?
                <div className="boxContainer "><div className="erreur">{msgErreurGetBlock}</div></div>
            :
            <>
                <div className="boxContainer ">
                    <table className={styles.tblInfos}>
                        <tbody>
                        {loadingOrNot ?
                            <tr><td colSpan="5">Loading data from blockchain (fcd), please wait ...</td></tr>
                        :   
                        <>
                            <tr>
                                <td>Height :</td>
                                <td>{blockNum}</td>
                            </tr>
                            <tr>
                                <td>Date/Time :</td>
                                <td>{metEnFormeDateTime(tblBlocks[blockNum].datetime)}</td>
                            </tr>
                            <tr>
                                <td>Number of transactions :</td>
                                <td>{tblBlocks[blockNum].nb_tx}</td>
                            </tr>
                            <tr>
                                <td>Proposer (this validator) :</td>
                                <td><Link to={"/validators/" + tblBlocks[blockNum].validator_address}>{tblBlocks[blockNum].validator_moniker}</Link></td>
                            </tr>
                        </>   
                        }
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="boxContainer ">
                    <h2><ExchangeIcon /><span>Transactions</span></h2>
                    {tblBlocks && tblBlocks[blockNum] && tblBlocks[blockNum].txs ? 
                        <table className={styles.tblTransactions}>
                            <thead>
                                <tr>
                                    <th>Hash</th>
                                    <th>Type</th>
                                    <th>From</th>
                                    <th>To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tblBlocks[blockNum].txs.map((valeur, clef) => {
                                    return <tr key={clef}>
                                        <td><Link to={"/transactions/" + valeur.tx_hash}>{valeur.tx_hash}</Link></td>
                                        <td>
                                            {valeur.tx_description}<br />
                                            {valeur.tx_status === 0 ? <span className='succes'>(SUCCESS)</span> : <span className='erreur'>(FAILED)</span>}
                                        </td>
                                        <td>
                                            {valeur.tx_description === 'MsgSend' || valeur.tx_description === 'MsgDelegate' || valeur.tx_description === 'MsgTransfer' ?
                                                <>
                                                    Account : {isValidTerraAddressFormat(valeur.tx_from_account, 'terra1') ? <Link to={"/accounts/" + valeur.tx_from_account}>{valeur.tx_from_account}</Link> : valeur.tx_from_account}<br />
                                                    {valeur.tx_from_valoper ? 
                                                        <span>Of validator : <Link to={"/validators/" + valeur.tx_from_valoper}>{valeur.tx_from_name}</Link></span>
                                                        : null
                                                    }
                                                </> : null
                                            }
                                            {valeur.tx_description === 'MsgUndelegate' ? <span>Validator : <Link to={"/validators/" + valeur.tx_from_valoper}>{valeur.tx_from_name}</Link></span> : null}
                                        </td>
                                        <td>
                                            {valeur.tx_description === 'MsgSend' || valeur.tx_description === 'MsgUndelegate' || valeur.tx_description === 'MsgTransfer' ?
                                                <>
                                                    Account : {isValidTerraAddressFormat(valeur.tx_to_account, 'terra1') ? <Link to={"/accounts/" + valeur.tx_to_account}>{valeur.tx_from_account}</Link> : valeur.tx_to_account}<br />
                                                    {valeur.tx_to_valoper ? 
                                                        <span>Of validator : <Link to={"/validators/" + valeur.tx_to_valoper}>{valeur.tx_to_name}</Link></span>
                                                        : null
                                                    }
                                                </> : null
                                            }
                                            {valeur.tx_description === 'MsgDelegate' ? <span>Validator : <Link to={"/validators/" + valeur.tx_to_valoper}>{valeur.tx_to_name}</Link></span> : null}
                                        </td>
                                        {/* <td>
                                            {valeur[3] === 'Undelegate' ? <><span>Validator : </span><Link to={"/validators/" + valeur[4]}>{valeur[6]}</Link></> : null}
                                            {valeur[3] === 'Begin Redelegate' ? <><span>Account : </span><Link to={"/accounts/" + valeur[4]}>{valeur[4]}</Link></> : null}
                                            {valeur[3] === 'Vote' ?
                                                valeur[6] === '' ?
                                                    <><span>Account : </span><Link to={"/accounts/" + valeur[4]}>{valeur[4]}</Link></>
                                                :
                                                    <>
                                                        <span>Validator : </span>
                                                        <Link to={"/validators/" + valeur[4]}>{valeur[6]}</Link>
                                                        {valeur[7] !== '' ? <><br /><span>(through his account <Link to={"/accounts/" + valeur[7]}>{valeur[7]}</Link>)</span></> : null}
                                                    </>
                                            : null}
                                            {valeur[3] === 'Withdraw Delegator Reward' ? <><span>Validator : </span><Link to={"/validators/" + valeur[4]}>{valeur[6]}</Link></> : null}
                                            {valeur[3] === 'Withdraw Validator Commission' ? <><span>Validator : </span><Link to={"/validators/" + valeur[4]}>{valeur[6]}</Link></> : null}
                                            {valeur[3] !== 'Send'
                                                && valeur[3] !== 'Delegate'
                                                && valeur[3] !== 'Undelegate'
                                                && valeur[3] !== 'Begin Redelegate'
                                                && valeur[3] !== 'Vote'
                                                && valeur[3] !== 'Withdraw Delegator Reward'
                                                && valeur[3] !== 'Withdraw Validator Commission'
                                                ? "--" : null
                                            }
                                        </td> */}
                                        {/* <td>
                                            {valeur[3] === 'Undelegate' ? <><span>Account : </span><Link to={"/accounts/" + valeur[5]}>{valeur[5]}</Link></> : null}
                                            {valeur[3] === 'Begin Redelegate' ? <><span>Validator : </span><Link to={"/validators/" + valeur[5]}>{valeur[6]}</Link></> : null}
                                            {valeur[3] === 'Vote' ? <><span>Proposal : </span><Link to={"/proposals/" + valeur[5]}>#{valeur[5]}</Link></> : null}
                                            {valeur[3] === 'Withdraw Delegator Reward' ? <><span>Account : </span><Link to={"/accounts/" + valeur[5]}>{valeur[5]}</Link></> : null}
                                            {valeur[3] === 'Withdraw Validator Commission' ? <><span>Account : </span><Link to={"/accounts/" + valeur[5]}>{valeur[5]}</Link></> : null}
                                            {valeur[3] !== 'Send'
                                                && valeur[3] !== 'Delegate'
                                                && valeur[3] !== 'Undelegate'
                                                && valeur[3] !== 'Begin Redelegate'
                                                && valeur[3] !== 'Vote'
                                                && valeur[3] !== 'Withdraw Delegator Reward'
                                                && valeur[3] !== 'Withdraw Validator Commission'
                                                ? "--" : null
                                            }                                  
                                        </td> */}
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    : <p>No transaction.</p>
                }
                </div>
            </>
            }
        </>
    );
};

export default PageBlock;