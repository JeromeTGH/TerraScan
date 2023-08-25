import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposal.module.scss';
import { getProposal } from './getProposal';
import { formateLeNombre, metEnFormeDateTime } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';


const PageProposal = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { propID } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    // Variables React
    const [proposalInfos, setProposalInfos] = useState();
    const [msgErreur, setMsgErreur] = useState();
    const [filtre, setFiltre] = useState("DID_NOT_VOTE");


    // Fonction de sélection de filtre
    const handleClickOnFilter = (val) => {
        setFiltre(val);
    }


    // Chargement au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Proposal #' + propID + ' - ' + appName;

        // Récupération de la proposition ciblée
        getProposal(propID).then((res) => {
            if(res['erreur']) {
                setMsgErreur(res['erreur']);
                setProposalInfos({});
            }
            else {
                setMsgErreur('');

                if(res['status'] === 3 || res['status'] === 4)
                    setFiltre("VOTE_OPTION_YES");

                setProposalInfos(res);
            }
        })
        // eslint-disable-next-line
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
                                    proposalInfos['proposerAddress'] ?
                                        <Link to={"/accounts/" + proposalInfos['proposerAddress']}>{proposalInfos['proposerAddress']}</Link>
                                    :
                                        <span>(unknown)</span>
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
                        <div className={"boxContainer " + styles.propContainer}>
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
                                            <td><strong>Proposal #{propID}</strong></td>
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
                                            <td>
                                                {proposalInfos['pourcentageOfVoters'].toFixed(2)}% voted
                                                {proposalInfos['pourcentageOfVoters'] < proposalInfos['seuilDuQuorum'] ?
                                                <span className='erreur'><strong> (quorum not reached)</strong></span>
                                                :
                                                <span className='succes'><strong> (quorum reached)</strong></span>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Total of YES votes :</td>
                                            <td>{(proposalInfos['nbVotesYesLunc']/1000000).toFixed(6)} (<strong>{proposalInfos['pourcentageOfYes'].toFixed(2)}%&nbsp;of&nbsp;YES</strong>)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of ABSTAIN votes :</td>
                                            <td>{(proposalInfos['nbVotesAbstainLunc']/1000000).toFixed(6)} (<strong>{proposalInfos['pourcentageOfAbstain'].toFixed(2)}%&nbsp;of&nbsp;ABSTAIN</strong>)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of NO votes :</td>
                                            <td>{(proposalInfos['nbVotesNoLunc']/1000000).toFixed(6)} (<strong>{proposalInfos['pourcentageOfNo'].toFixed(2)}%&nbsp;of&nbsp;NO</strong>)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of VETO votes :</td>
                                            <td>{(proposalInfos['nbVotesNowithvetoLunc']/1000000).toFixed(6)} (<strong>{proposalInfos['pourcentageOfNoWithVeto'].toFixed(2)}%&nbsp;of&nbsp;VETO</strong>)</td>
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
                                        <tr>
                                            <td>Status :</td>
                                            <td><span className='colore'><strong>{proposalInfos['statutVote']}</strong></span></td>
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
                                            <td>{(proposalInfos['nbVotesYesLunc']/1000000).toFixed(6)} (<strong>{proposalInfos['pourcentageOfYes'].toFixed(2)}%&nbsp;of&nbsp;YES</strong>)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of ABSTAIN votes :</td>
                                            <td>{(proposalInfos['nbVotesAbstainLunc']/1000000).toFixed(6)} (<strong>{proposalInfos['pourcentageOfAbstain'].toFixed(2)}%&nbsp;of&nbsp;ABSTAIN</strong>)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of NO votes :</td>
                                            <td>{(proposalInfos['nbVotesNoLunc']/1000000).toFixed(6)} (<strong>{proposalInfos['pourcentageOfNo'].toFixed(2)}%&nbsp;of&nbsp;NO</strong>)</td>
                                        </tr>
                                        <tr>
                                            <td>Total of VETO votes :</td>
                                            <td>{(proposalInfos['nbVotesNowithvetoLunc']/1000000).toFixed(6)} (<strong>{proposalInfos['pourcentageOfNoWithVeto'].toFixed(2)}%&nbsp;of&nbsp;VETO</strong>)</td>
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

                        {proposalInfos['status'] === 2 && proposalInfos['tblDesVotesDeValidateur'] ?
                            <div className="boxContainer">
                                <h2 className={styles.h2titles}><strong>Validator's votes</strong></h2>
                                {Object.keys(proposalInfos['tblDesVotesDeValidateur']).length === 0 ?
                                    <div>No data returned by the LCD, sorry.</div>
                                :
                                    <>
                                        <div className={styles.tblPendingVotesFilter}>
                                            <button className={filtre === "DID_NOT_VOTE" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("DID_NOT_VOTE")}><strong>Did not vote</strong><span>(&nbsp;{proposalInfos['actual_DID_NOT_VOTE']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_YES" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_YES")}><strong>YES</strong><span>(&nbsp;{proposalInfos['actual_VOTE_OPTION_YES']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_ABSTAIN" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_ABSTAIN")}><strong>ABSTAIN</strong><span>(&nbsp;{proposalInfos['actual_VOTE_OPTION_ABSTAIN']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_NO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO")}><strong>NO</strong><span>(&nbsp;{proposalInfos['actual_VOTE_OPTION_NO']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_NO_WITH_VETO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO_WITH_VETO")}><strong>VETO</strong><span>(&nbsp;{proposalInfos['actual_VOTE_OPTION_NO_WITH_VETO']}&nbsp;)<br />↓</span></button>
                                        </div>
                                        <table className={styles.tblPendingValidatorsVotes}>
                                            <thead>
                                                <tr>
                                                    <th>Validator</th>
                                                    <th>Voting power</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(filtre === "DID_NOT_VOTE" && proposalInfos['actual_DID_NOT_VOTE'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator votes recorded here</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_YES" && proposalInfos['actual_VOTE_OPTION_YES'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted YES</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_ABSTAIN" && proposalInfos['actual_VOTE_OPTION_ABSTAIN'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted ABSTAIN</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_NO" && proposalInfos['actual_VOTE_OPTION_NO'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted NO</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_NO_WITH_VETO" && proposalInfos['actual_VOTE_OPTION_NO_WITH_VETO'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted NO WITH VETO</td>
                                                </tr> : null}
                                                {Object.entries(proposalInfos['tblDesVotesDeValidateur']).sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}).map((valeur, index) => {
                                                    return valeur[1].vote === filtre ? <tr key={index}>
                                                        <td><Link to={"/validators/" + valeur[0]}>{valeur[1].description_moniker}</Link></td>
                                                        <td>{valeur[1].voting_power_pourcentage.toFixed(2)}&nbsp;%</td>
                                                    </tr> : null
                                                })}
                                            </tbody>
                                        </table>
                                    </>
                                }
                            </div>
                        : null}
                        {(proposalInfos['status'] === 3 || proposalInfos['status'] === 4) && proposalInfos['tblDesVotesDeValidateur'] ?
                            <div className="boxContainer">
                                <h2 className={styles.h2titles}><strong>Validator's votes</strong></h2>
                                {Object.keys(proposalInfos['tblDesVotesDeValidateur']).length === 0 ?
                                    <div><br />No data returned by the LCD, sorry.<br /><br /></div>
                                :
                                    <>
                                        <div className={styles.tblClosedVotesFilter}>
                                            <button className={filtre === "VOTE_OPTION_YES" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_YES")}><strong>YES</strong><span>(&nbsp;{proposalInfos['actual_VOTE_OPTION_YES']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_ABSTAIN" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_ABSTAIN")}><strong>ABSTAIN</strong><span>(&nbsp;{proposalInfos['actual_VOTE_OPTION_ABSTAIN']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_NO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO")}><strong>NO</strong><span>(&nbsp;{proposalInfos['actual_VOTE_OPTION_NO']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_NO_WITH_VETO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO_WITH_VETO")}><strong>VETO</strong><span>(&nbsp;{proposalInfos['actual_VOTE_OPTION_NO_WITH_VETO']}&nbsp;)<br />↓</span></button>
                                        </div>
                                        <table className={styles.tblPendingValidatorsVotes}>
                                            <thead>
                                                <tr>
                                                    <th>Validator</th>
                                                    <th>Voting power</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(filtre === "VOTE_OPTION_YES" && proposalInfos['actual_VOTE_OPTION_YES'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted YES</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_ABSTAIN" && proposalInfos['actual_VOTE_OPTION_ABSTAIN'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted ABSTAIN</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_NO" && proposalInfos['actual_VOTE_OPTION_NO'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted NO</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_NO_WITH_VETO" && proposalInfos['actual_VOTE_OPTION_NO_WITH_VETO'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted NO WITH VETO</td>
                                                </tr> : null}

                                                {Object.entries(proposalInfos['tblDesVotesDeValidateur']).sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}).map((valeur, index) => {
                                                    return valeur[1].vote === filtre ? <tr key={index}>
                                                        <td><Link to={"/validators/" + valeur[0]}>{valeur[1].description_moniker}</Link></td>
                                                        <td>{valeur[1].voting_power_pourcentage.toFixed(2)}&nbsp;%</td>
                                                    </tr> : null
                                                })}
                                            </tbody>
                                        </table>
                                    </>
                                }
                            </div>
                        : null}
                        {(proposalInfos['status'] === 2 || proposalInfos['status'] === 3 || proposalInfos['status'] === 4) && proposalInfos['tblHistoriqueDesVotesValidateur'] ?
                            <div className="boxContainer">
                                <h2 className={styles.h2titles}><strong>HISTORY of validators votes</strong> (who did not abstain, so)</h2>
                                {Object.keys(proposalInfos['tblHistoriqueDesVotesValidateur']).length === 0 ?
                                    <div><br />No data returned by the LCD, sorry.<br /><br /></div>
                                :
                                    <>
                                        <div className={styles.comments}>
                                            <span><u>Note</u> : if a validator has changed his vote over time, then his name will appear multiple times here (because each/all vote are shown in this table)</span>
                                        </div>
                                        <table className={styles.tblHistoricalValidatorsVotes}>
                                            <thead>
                                                <tr>
                                                    <th>Date/Time</th>
                                                    <th>Validators</th>
                                                    <th>Votes (older to newer)</th>
                                                    <th>TxHash</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {proposalInfos['tblHistoriqueDesVotesValidateur'].map((valeur, index) => {
                                                    return <tr key={index}>
                                                        <td>{metEnFormeDateTime(valeur.datetime)}</td>
                                                        <td><Link to={"/validators/" + valeur.valoperaddress}>{valeur.valmoniker}</Link></td>
                                                        <td>
                                                            {valeur.vote === 'VOTE_OPTION_YES' ? <span className='textVoteYes'>YES</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_ABSTAIN' ? <span className='textVoteAbstain'>ABSTAIN</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_NO' ? <span className='textVoteNo'>NO</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_NO_WITH_VETO' ? <span className='textVoteNowithveto'>NO WITH VETO</span> : null}
                                                        </td>
                                                        <td><Link to={"/transactions/" + valeur.txhash}>{valeur.txhash}</Link></td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </>
                                }
                            </div>
                        : null}
                    </>
                        :
                        <div className="boxContainer"><div>Loading data from blockchain (lcd), please wait ...</div></div>
                }
            </div>
        </>
    );
};

export default PageProposal;