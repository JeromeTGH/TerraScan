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
            </div>
            {props.card.status === 2 ? 
                <div className={styles.cardFooter}>
                    <span>End : </span>
                    <span>{metEnFormeDateTime(props.card.voting_end_time)}</span>
                </div>
            : null }
            {(props.card.status === 3 || props.card.status === 4) ? 
                <div className={styles.cardFooter}>
                    <span>Ended : </span>
                    <span>{metEnFormeDateTime(props.card.voting_end_time)}</span>
                </div>
            : null }
        </div>
    );
};

export default ProposalCard;