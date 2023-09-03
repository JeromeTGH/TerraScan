import React from 'react';
import styles from './ProposalCard.module.scss';
import { metEnFormeDateTime } from '../../application/AppUtils';
import { MessageIcon } from '../../application/AppIcons';

const ProposalCard = (props) => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardHeader}>
                <div className={styles.cardProposalID}><MessageIcon />&nbsp;&nbsp;Proposal&nbsp;|&nbsp;{props.card.id}</div>
                {props.card.status === 1 ? <div className={styles.cardProposalStatusOrange}>Waiting&nbsp;deposit</div> : null}
                {props.card.status === 2 ? <div className={styles.cardProposalStatusBlue}>Voting&nbsp;in&nbsp;progress</div> : null}
                {props.card.status === 3 ? <div className={styles.cardProposalStatusGreen}>Adopted</div> : null}
                {props.card.status === 4 ? <div className={styles.cardProposalStatusRed}>Rejected</div> : null}
                {props.card.status === -1 || props.card.status === 0 || props.card.status === 5 ? <div className={styles.cardProposalStatusGray}>Unknown&nbsp;status</div> : null}
            </div>
            <div className={styles.cardBody}>
                <div className={styles.cardProposalTitle}>{props.card.content.title}</div>
                {props.card.status === 1 ? 
                <>
                    <table className={styles.cardProposalTable}>
                        <tbody>
                            <tr>
                                <td>Submit time :</td>
                                <td>{metEnFormeDateTime(props.card.submit_time)}</td>
                            </tr>
                            <tr>
                                <td><strong>Deposit end time :</strong></td>
                                <td><strong>{metEnFormeDateTime(props.card.deposit_end_time)}</strong></td>
                            </tr>
                            <tr>
                                <td>Period progress :</td>
                                <td>
                                    <div className={styles.supportBar}>
                                        <div style={{ width: props.card.pourcentageOfDepositPeriod + "%"}} className='barNeutral'>&nbsp;</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>Amount deposed :</td>
                                <td>{props.card.totalDeposit} / {props.card.nbMinDepositLunc} LUNC</td>
                            </tr>
                            <tr>
                                <td className='colore'><strong>Pourcentage deposed :</strong></td>
                                <td className='colore'><strong>{props.card.pourcentageDeposit.toFixed(2)}%</strong></td>
                            </tr>
                            <tr>
                                <td>Deposit amount :</td>
                                <td>
                                    <div className={styles.supportBar}>
                                        <div style={{ width: props.card.pourcentageDeposit + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
                : null}
                {props.card.status === 2 ? 
                <>
                    <table className={styles.cardProposalTable}>
                        <tbody>
                            <tr>
                                <td>Votes :</td>
                                {props.card.isQuorumReached ? 
                                    props.card.isVetoReached ?
                                        <td>
                                            <div className={styles.vetoCursor} style={{ width: props.card.seuilVeto*2 + "%"}}>
                                                <div>Threshold</div>
                                                <div>|</div>
                                            </div>
                                            <div className={styles.supportBar}>
                                                <div style={{ width: props.card.pourcentageOfNoWithVeto + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                                <div style={{ width: props.card.pourcentageOfNo + "%"}} className='barVoteNo'>&nbsp;</div>
                                                <div style={{ width: props.card.pourcentageOfYes + "%"}} className='barVoteYes'>&nbsp;</div>
                                                <div style={{ width: props.card.pourcentageOfAbstain + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                            </div>
                                        </td>
                                    :
                                        <td>
                                            <div className={styles.voteCursor} style={{ width: props.card.seuilAcceptation*2 + "%"}}>
                                                <div>Threshold</div>
                                                <div>|</div>
                                            </div>
                                            <div className={styles.supportBar}>
                                                <div style={{ width: props.card.pourcentageOfYes + "%"}} className='barVoteYes'>&nbsp;</div>
                                                <div style={{ width: props.card.pourcentageOfNo + "%"}} className='barVoteNo'>&nbsp;</div>
                                                <div style={{ width: props.card.pourcentageOfNoWithVeto + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                                <div style={{ width: props.card.pourcentageOfAbstain + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                            </div>
                                        </td>         
                                    :
                                    <td>
                                        <div className={styles.quorumCursor} style={{ width: props.card.seuilQuorum*2 + "%"}}>
                                            <div>Quorum</div>
                                            <div>|</div>
                                        </div>
                                        <div className={styles.supportBar}>
                                            <div style={{ width: props.card.pourcentageOfYes + "%"}} className='barVoteYes'>&nbsp;</div>
                                            <div style={{ width: props.card.pourcentageOfNo + "%"}} className='barVoteNo'>&nbsp;</div>
                                            <div style={{ width: props.card.pourcentageOfNoWithVeto + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                            <div style={{ width: props.card.pourcentageOfAbstain + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                        </div>
                                    </td>
                                }
                            </tr>
                            <tr>
                                <td>Vote period :</td>
                                <td>
                                    <div className={styles.supportBar}>
                                        <div style={{ width: props.card.pourcentageOfVotePeriod + "%"}} className='barNeutral'>&nbsp;</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={"colore " + styles.cardVoteText}>Status : <strong>{props.card.statutVote}</strong></div>
                </>
                : null}
                {(props.card.status === 3 || props.card.status === 4) ? 
                <>
                    <table className={styles.cardProposalTable}>
                        <tbody>
                        <tr>
                                <td>Vote start :</td>
                                <td>{metEnFormeDateTime(props.card.voting_start_time)}</td>
                            </tr>
                            <tr>
                                <td>Vote end :</td>
                                <td>{metEnFormeDateTime(props.card.voting_end_time)}</td>
                            </tr>
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>Votes :</td>
                                <td>
                                    <div className={styles.supportBar}>
                                        <div style={{ width: props.card.pourcentageOfYes + "%"}} className='barVoteYes'>&nbsp;</div>
                                        <div style={{ width: props.card.pourcentageOfNo + "%"}} className='barVoteNo'>&nbsp;</div>
                                        <div style={{ width: props.card.pourcentageOfNoWithVeto + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                        <div style={{ width: props.card.pourcentageOfAbstain + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
                : null}
            </div>
            {props.card.status === 2 ? 
                <div className={styles.cardFooter}>
                    <span>End : </span>
                    <span>{metEnFormeDateTime(props.card.voting_end_time)}</span>
                </div>
            : null }
        </div>
    );
};

export default ProposalCard;