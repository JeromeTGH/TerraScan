import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposal.module.scss';
import { getProposal } from './getProposal';
import { formateLeNombre, metEnFormeDateTime } from '../../application/AppUtils';


const PageProposal = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { propID } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    // Variables React
    const [proposalInfos, setProposalInfos] = useState();
    const [msgErreur, setMsgErreur] = useState();


    // Chargement au démarrage
    useEffect(() => {
        getProposal(propID).then((res) => {
            if(res['erreur']) {
                setMsgErreur(res['erreur']);
                setProposalInfos({});
            }
            else {
                setMsgErreur('');
                setProposalInfos(res);
            }
        })
    }, [propID])


    // Affichage
    return (
        <>
            <h1><span><VoteIcon /><strong>Proposal</strong> #{propID}</span></h1>
            <div className={styles.blocksProposalInfos}>
                {msgErreur ? 
                    <div className="erreur">{msgErreur}</div>
                    :
                    proposalInfos && proposalInfos['contentDescription'] ?
                    <>
                        <div className={styles.headInfos}>
                            <p><u>Date creation</u> : {metEnFormeDateTime(proposalInfos['submitDatetime'])}</p>
                            <p><u>Created by</u> : {
                                proposalInfos['proposerValAddress'] ?
                                    <>
                                        <Link to={"/validators/" + proposalInfos['proposerValAddress']}>{proposalInfos['proposerValMoniker']}</Link>
                                        <br/><span>(through his account </span>
                                        <Link to={"/accounts/" + proposalInfos['proposerAddress']}>{proposalInfos['proposerAddress']}</Link>
                                        <span>)</span>
                                    </>
                                :
                                    <Link to={"/accounts/" + proposalInfos['proposerAddress']}>{proposalInfos['proposerAddress']}</Link>
                                }
                            </p>
                        </div>
                        <div>Status : {proposalInfos['status'] === 3 ?
                            <span className='succes'><strong>{proposalInfos['statusText']}</strong></span>
                            :
                            proposalInfos['status'] === 4 ?
                                <span className='erreur'><strong>{proposalInfos['statusText']}</strong></span>
                                :
                                <span className='colore'><strong>{proposalInfos['statusText']}</strong></span>
                            }
                        </div>
                        <div className="boxContainer">
                            <h2 className={styles.h2titles}><strong>Proposal : </strong>{proposalInfos['contentTitle']}</h2>
                            <p className={styles.contentDescription}>{proposalInfos['contentDescription']}</p>
                        </div>
                        {proposalInfos['status'] === 1 ?
                            <div className="boxContainer">
                                <h2 className={styles.h2titles}><strong>Votes</strong> (pending for enough deposits)</h2>
                                <table className={styles.tblInfos}>
                                    <tbody>
                                        <tr>
                                            <td>Proposal ID :</td>
                                            <td>{propID}</td>
                                        </tr>
                                        <tr>
                                            <td>Amount of LUNC required :</td>
                                            <td>{formateLeNombre(proposalInfos['nbMinDepositLunc'], '\u00a0')} LUNC</td>
                                        </tr>
                                        <tr>
                                            <td>Amount of LUNC deposited :</td>
                                            <td>{formateLeNombre(proposalInfos['totalDeposit'], '\u00a0')} LUNC</td>
                                        </tr>
                                        <tr>
                                            <td>Ratio LUNC deposited/required :</td>
                                            <td>{proposalInfos['pourcentageDeLuncFournisSurRequis']}%</td>
                                        </tr>
                                        <tr>
                                            <td>Progress :</td>
                                            <td>
                                                <div className={styles.supportBar}>
                                                    <div style={{ width: proposalInfos['pourcentageDeLuncFournisSurRequis'] + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Deposit end time :</td>
                                            <td>{metEnFormeDateTime(proposalInfos['depositEndTime'])}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        : null}
                        {proposalInfos['status'] === 2 ?
                            <div className="boxContainer">
                                <h2 className={styles.h2titles}><strong>Votes</strong> (in progress)</h2>
                                <table className={styles.tblInfos}>
                                    <tbody>
                                        <tr>
                                            <td>Proposal ID :</td>
                                            <td>{propID}</td>
                                        </tr>
                                        <tr>
                                            <td>Voting start time :</td>
                                            <td>{metEnFormeDateTime(proposalInfos['votingStartTime'])}</td>
                                        </tr>
                                        <tr>
                                            <td>Total of staked LUNC :</td>
                                            <td>{(proposalInfos['nbStakedLunc']/1000000).toFixed(6)} LUNC (100%)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of voters :</td>
                                            <td>{(proposalInfos['nbVotersLunc']/1000000).toFixed(6)} LUNC ({proposalInfos['pourcentageOfVoters'].toFixed(2)}%)</td>
                                        </tr>
                                        <tr>
                                            <td>Quorum :</td>
                                            <td>{proposalInfos['pourcentageOfVoters'].toFixed(2)}% voted</td>
                                        </tr>
                                        <tr>
                                            <td>Status :</td>
                                            <td>{proposalInfos['pourcentageOfVoters'] < proposalInfos['seuilDuQuorum'] ?
                                                <span className='erreur'><strong>{proposalInfos['statutVote']}</strong></span>
                                                :
                                                <span className='colore'><strong>{proposalInfos['statutVote']}</strong></span>}
                                        </td>
                                        </tr>
                                        <tr>
                                            <td>Total of YES votes :</td>
                                            <td>{(proposalInfos['nbVotesYesLunc']/1000000).toFixed(6)} ({proposalInfos['pourcentageOfYes'].toFixed(2)}%)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of ABSTAIN votes :</td>
                                            <td>{(proposalInfos['nbVotesAbstainLunc']/1000000).toFixed(6)} ({proposalInfos['pourcentageOfAbstain'].toFixed(2)}%)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of NO votes :</td>
                                            <td>{(proposalInfos['nbVotesNoLunc']/1000000).toFixed(6)} ({proposalInfos['pourcentageOfNo'].toFixed(2)}%)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of VETO votes :</td>
                                            <td>{(proposalInfos['nbVotesNowithvetoLunc']/1000000).toFixed(6)} ({proposalInfos['pourcentageOfNoWithVeto'].toFixed(2)}%)</td>
                                        </tr>
                                        <tr>
                                            <td>Votes :</td>
                                            <td>
                                                <div className={styles.supportBar}>
                                                    <div style={{ width: proposalInfos['pourcentageOfYes'] + "%"}} className='barVoteYes'>&nbsp;</div>
                                                    <div style={{ width: proposalInfos['pourcentageOfAbstain'] + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                                    <div style={{ width: proposalInfos['pourcentageOfNo'] + "%"}} className='barVoteNo'>&nbsp;</div>
                                                    <div style={{ width: proposalInfos['pourcentageOfNoWithVeto'] + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>YES vs NO+VETO :</td>
                                            <td><strong><span className='succes'>{proposalInfos['pourcentageOfYESvsNOs'].toFixed(2)}%</span> YES</strong> / <strong><span className='erreur'>{proposalInfos['pourcentageOfNOsvsYES'].toFixed(2)}%</span> NO</strong> (if abstain votes are excluded)</td>
                                        </tr>
                                        <tr>
                                            <td>Voting end time :</td>
                                            <td>{metEnFormeDateTime(proposalInfos['votingEndTime'])}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        : null}
                        {(proposalInfos['status'] === 3 || proposalInfos['status'] === 4) ?
                            <div className="boxContainer">
                                <h2 className={styles.h2titles}><strong>Votes</strong> (voting complete)</h2>
                                <table className={styles.tblInfos}>
                                    <tbody>
                                        <tr>
                                            <td>Proposal ID :</td>
                                            <td>{propID}</td>
                                        </tr>
                                        <tr>
                                            <td>Voting start time :</td>
                                            <td>{metEnFormeDateTime(proposalInfos['votingStartTime'])}</td>
                                        </tr>
                                        <tr>
                                            <td>Total of voters :</td>
                                            <td>{(proposalInfos['nbVotersLunc']/1000000).toFixed(6)} LUNC</td>
                                        </tr>
                                        <tr>
                                            <td>Status :</td>
                                            <td>
                                                {proposalInfos['status'] === 3 ?
                                                    <span className='succes'><strong>{proposalInfos['statutVote']}</strong></span>
                                                :
                                                    <span className='erreur'><strong>{proposalInfos['statutVote']}</strong></span>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Total of YES votes :</td>
                                            <td>{(proposalInfos['nbVotesYesLunc']/1000000).toFixed(6)} ({proposalInfos['pourcentageOfYes'].toFixed(2)}% of voters)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of ABSTAIN votes :</td>
                                            <td>{(proposalInfos['nbVotesAbstainLunc']/1000000).toFixed(6)} ({proposalInfos['pourcentageOfAbstain'].toFixed(2)}% of voters)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of NO votes :</td>
                                            <td>{(proposalInfos['nbVotesNoLunc']/1000000).toFixed(6)} ({proposalInfos['pourcentageOfNo'].toFixed(2)}% of voters)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of VETO votes :</td>
                                            <td>{(proposalInfos['nbVotesNowithvetoLunc']/1000000).toFixed(6)} ({proposalInfos['pourcentageOfNoWithVeto'].toFixed(2)}% of voters)</td>
                                        </tr>
                                        <tr>
                                            <td>Distribution of voters :</td>
                                            <td>
                                                <div className={styles.supportBar}>
                                                    <div style={{ width: proposalInfos['pourcentageOfYes'] + "%"}} className='barVoteYes'>&nbsp;</div>
                                                    <div style={{ width: proposalInfos['pourcentageOfAbstain'] + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                                    <div style={{ width: proposalInfos['pourcentageOfNo'] + "%"}} className='barVoteNo'>&nbsp;</div>
                                                    <div style={{ width: proposalInfos['pourcentageOfNoWithVeto'] + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>YES / NO+VETO :</td>
                                            <td><strong><span className='succes'>{proposalInfos['pourcentageOfYESvsNOs'].toFixed(2)}%</span> YES</strong> / <strong><span className='erreur'>{proposalInfos['pourcentageOfNOsvsYES'].toFixed(2)}%</span> NO</strong> (if abstain votes are excluded)</td>
                                        </tr>
                                        <tr>
                                            <td>Voting end time :</td>
                                            <td>{metEnFormeDateTime(proposalInfos['votingEndTime'])}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        : null}
                    </>
                        :
                        <div>Loading data from blockchain (lcd) ...</div>
                }
            </div>
        </>
    );
};

export default PageProposal;