import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlocksIcon } from '../../application/AppIcons';
import styles from './PageBlock.module.scss';
// import BlockDetail from './BlockDetail';
// import BlockTransactions from './BlockTransactions';
import { appName } from '../../application/AppParams';
import { getBlockInfo } from './getBlockInfo';
import { tblBlocks } from '../../application/AppData';
import { isValidTerraAddressFormat, metEnFormeDateTime } from '../../application/AppUtils';
import StyledBox from '../../sharedComponents/StyledBox';

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
        getBlockInfo(blockNum).then((res) => {
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
                </StyledBox>
                <StyledBox title="Transactions" color="blue">
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
                                {tblBlocks[blockNum].txs.length === 0 ?
                                <tr><td colSpan="4">No transaction.</td></tr>
                                :
                                tblBlocks[blockNum].txs.map((valeur, clef) => {
                                    return <tr key={clef}>
                                        <td><Link to={"/transactions/" + valeur.tx_hash}>{valeur.tx_hash}</Link></td>
                                        <td>
                                            {valeur.tx_description ? valeur.tx_description : valeur.tx_type}<br />
                                            {valeur.tx_status === 0 ? <span className='succes'>(SUCCESS)</span> : <span className='erreur'>(FAILED)</span>}
                                        </td>
                                        <td>
                                            {valeur.tx_type === 'MsgSend' ||
                                             valeur.tx_type === 'MsgDelegate' ||
                                             valeur.tx_type === 'MsgTransfer' ||
                                             valeur.tx_type === 'MsgBeginRedelegate' ||
                                             valeur.tx_type === 'MsgVote'
                                             ?
                                                <>
                                                    Account : {isValidTerraAddressFormat(valeur.tx_from_account, 'terra1') ? <Link to={"/accounts/" + valeur.tx_from_account}>{valeur.tx_from_account}</Link> : valeur.tx_from_account}<br />
                                                    {valeur.tx_from_valoper ? 
                                                        <span>Of validator : <Link to={"/validators/" + valeur.tx_from_valoper}>{valeur.tx_from_name}</Link></span>
                                                        : null
                                                    }
                                                </> : null
                                            }
                                            {valeur.tx_type === 'MsgUndelegate' ||
                                             valeur.tx_type === 'MsgWithdrawDelegatorReward' ||
                                             valeur.tx_type === 'MsgWithdrawDelegationReward' ||
                                             valeur.tx_type === 'MsgWithdrawValidatorCommission'
                                            ? <span>Validator : <Link to={"/validators/" + valeur.tx_from_valoper}>{valeur.tx_from_name}</Link></span> : null}
                                            {valeur.tx_type !== 'MsgSend'
                                                && valeur.tx_type !== 'MsgDelegate'
                                                && valeur.tx_type !== 'MsgTransfer'
                                                && valeur.tx_type !== 'MsgBeginRedelegate'
                                                && valeur.tx_type !== 'MsgVote'
                                                && valeur.tx_type !== 'MsgUndelegate'
                                                && valeur.tx_type !== 'MsgWithdrawDelegatorReward'
                                                && valeur.tx_type !== 'MsgWithdrawDelegationReward'
                                                && valeur.tx_type !== 'MsgWithdrawValidatorCommission'
                                                ? "--" : null
                                            }
                                        </td>
                                        <td>
                                            {valeur.tx_type === 'MsgSend' ||
                                             valeur.tx_type === 'MsgUndelegate' || 
                                             valeur.tx_type === 'MsgTransfer' ||
                                             valeur.tx_type === 'MsgWithdrawDelegatorReward' ||
                                             valeur.tx_type === 'MsgWithdrawDelegationReward' ||
                                             valeur.tx_type === 'MsgWithdrawValidatorCommission'
                                             ?
                                                <>
                                                    Account : {isValidTerraAddressFormat(valeur.tx_to_account, 'terra1') ? <Link to={"/accounts/" + valeur.tx_to_account}>{valeur.tx_to_account}</Link> : valeur.tx_to_account}<br />
                                                    {valeur.tx_to_valoper ? 
                                                        <span>Of validator : <Link to={"/validators/" + valeur.tx_to_valoper}>{valeur.tx_to_name}</Link></span>
                                                        : null
                                                    }
                                                </> : null
                                            }
                                            {valeur.tx_type === 'MsgDelegate' ||
                                             valeur.tx_type === 'MsgBeginRedelegate' 
                                             ? <span>Validator : <Link to={"/validators/" + valeur.tx_to_valoper}>{valeur.tx_to_name}</Link></span> : null}
                                            {valeur.tx_type === 'MsgVote' ? <>
                                                Voted : <span className='colore'>{valeur.vote_choice}</span><br />
                                                <span>On proposal : <Link to={"/proposals/" + valeur.proposal_id}>#{valeur.proposal_id}</Link></span>
                                            </> : null}
                                            {valeur.tx_type !== 'MsgSend'
                                                && valeur.tx_type !== 'MsgDelegate'
                                                && valeur.tx_type !== 'MsgTransfer'
                                                && valeur.tx_type !== 'MsgBeginRedelegate'
                                                && valeur.tx_type !== 'MsgVote'
                                                && valeur.tx_type !== 'MsgUndelegate'
                                                && valeur.tx_type !== 'MsgWithdrawDelegatorReward'
                                                && valeur.tx_type !== 'MsgWithdrawDelegationReward'
                                                && valeur.tx_type !== 'MsgWithdrawValidatorCommission'
                                                ? "--" : null
                                            }
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
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