import React from 'react';
import styles from './BlockTxMessages.module.scss';
import { MessageIcon } from '../../application/AppIcons';

const BlockTxMessages = (props) => {

    
    return (
        <div className={"boxContainer " + styles.messagesBlock}>
            <h2><MessageIcon /><span>Messages {props.idxElement}/{props.nbElements}</span></h2>
            <p>À venir... !</p>
            {/* {tableBlockTransactions ? 
                tableBlockTransactions.length > 0 ? 
                    <table className={styles.tblMessages}>
                        <thead>
                            <tr>
                                <th>Hash</th>
                                <th>Type</th>
                                <th>From</th>
                                <th>To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableBlockTransactions.map((valeur, clef) => {
                                return <tr key={clef}>
                                    <td><Link to={"/transactions/" + valeur[0]}>{valeur[0]}</Link></td>
                                    <td>
                                        {valeur[3]}<br />
                                        {valeur[1] === 0 ? <span className='succes'>(SUCCESS)</span> : <span className='erreur'>(FAILED)</span>}
                                    </td>
                                    <td>
                                        {valeur[3] === 'Send' ? <><span>Account : </span><Link to={"/accounts/" + valeur[4]}>{valeur[4]}</Link></> : null}
                                        {valeur[3] === 'Delegate' ? <><span>Account : </span><Link to={"/accounts/" + valeur[4]}>{valeur[4]}</Link></> : null}
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
                                    </td>
                                    <td>
                                        {valeur[3] === 'Send' ? <><span>Account : </span><Link to={"/accounts/" + valeur[5]}>{valeur[5]}</Link></> : null}
                                        {valeur[3] === 'Delegate' ? <><span>Validator : </span><Link to={"/validators/" + valeur[5]}>{valeur[6]}</Link></> : null}
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
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                : (msgErreurTableBlockTransactions === '' ? <p>No transaction.</p> : null)
                : <p>Loading data from blockchain ...</p>
            }
            <div className="erreur">{msgErreurTableBlockTransactions}</div> */}
        </div>
    );
};

export default BlockTxMessages;