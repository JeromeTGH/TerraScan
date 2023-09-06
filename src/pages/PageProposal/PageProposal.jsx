import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposal.module.scss';
import { getProposal } from './getProposal';
import { formateLeNombre, metEnFormeDateTime } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import Chart from 'react-apexcharts';
// import { getDelegatorsParticipation } from './getDelegatorsParticipation';


const PageProposal = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { propID } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    // Variables React
    const [proposalInfos, setProposalInfos] = useState();
    const [msgErreur, setMsgErreur] = useState();
    const [filtre, setFiltre] = useState("DID_NOT_VOTE");
    // const [delegatorsVoteTurnout, setDelegatorsVoteTurnout] = useState("loading...");
    const [validatorVotesPagination, setValidatorVotesPagination] = useState(0);


    // Autres variables, constantes
    const nbElementsParPagination = 20;

    // Fonction de sélection de page, pour la liste des votes de validateurs
    const handleClickValidatorsVotesList = (val) => {
        setValidatorVotesPagination(val);
    }


    // Fonction de sélection de filtre
    const handleClickOnFilter = (val) => {
        setValidatorVotesPagination(0);
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
                setMsgErreur('');                                       // Effacement des éventuels message d'erreur
                setValidatorVotesPagination(0);                         // Fixation de la pagination à l'origine (page 1, par défaut, bien évidemment)
                if(res['status'] === 3 || res['status'] === 4)          // Fixation du filtre par défaut, suivant le type de status de proposition
                    setFiltre("VOTE_OPTION_YES");
                if(res['status'] === 2)
                    setFiltre("DID_NOT_VOTE");
                setProposalInfos(res);                                  // Et transmission des données, pour mise à jour ici

                // Chargement de données complémentaires
                // getDelegatorsParticipation().then((res) => {
                //     setDelegatorsVoteTurnout(res);
                // }).catch(err => {
                //     console.log("delegations err", err);
                // })
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
                        {(proposalInfos['contentAmount'] && proposalInfos['contentRecipient']) ?
                            <div className={"boxContainer " + styles.propContainer}>
                                <h2 className={styles.h2titles}><strong>Details</strong></h2>
                                <p><strong>Send</strong> : {proposalInfos['contentAmount']}</p>
                                <p><strong>To</strong>&nbsp;:&nbsp;<Link to={'/accounts/' + proposalInfos['contentRecipient']}>{proposalInfos['contentRecipient']}</Link></p>
                                <br />
                            </div>
                        : null}
                        {proposalInfos['contentChanges'] ?
                            <div className={"boxContainer " + styles.propContainer}>
                                <h2 className={styles.h2titles}><strong>Changes</strong></h2>
                                <p><pre>{JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(proposalInfos['contentChanges'], null, 2))), null, 2)}</pre></p>
                                <br />
                            </div>
                        : null}
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
                                            <button className={filtre === "DID_NOT_VOTE" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("DID_NOT_VOTE")}><strong>Did not vote</strong><span>(&nbsp;{proposalInfos['validator_DID_NOT_VOTE']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_YES" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_YES")}><strong>YES</strong><span>(&nbsp;{proposalInfos['validator_VOTE_OPTION_YES']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_ABSTAIN" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_ABSTAIN")}><strong>ABSTAIN</strong><span>(&nbsp;{proposalInfos['validator_VOTE_OPTION_ABSTAIN']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_NO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO")}><strong>NO</strong><span>(&nbsp;{proposalInfos['validator_VOTE_OPTION_NO']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_NO_WITH_VETO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO_WITH_VETO")}><strong>VETO</strong><span>(&nbsp;{proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']}&nbsp;)<br />↓</span></button>
                                        </div>
                                        <table className={styles.tblPendingValidatorsVotes}>
                                            <thead>
                                                <tr>
                                                    <th>Validator</th>
                                                    <th>Voting power</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(filtre === "DID_NOT_VOTE" && proposalInfos['validator_DID_NOT_VOTE'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator votes recorded here</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_YES" && proposalInfos['validator_VOTE_OPTION_YES'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted YES</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_ABSTAIN" && proposalInfos['validator_VOTE_OPTION_ABSTAIN'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted ABSTAIN</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_NO" && proposalInfos['validator_VOTE_OPTION_NO'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted NO</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_NO_WITH_VETO" && proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted NO WITH VETO</td>
                                                </tr> : null}
                                                {Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}).slice(validatorVotesPagination*nbElementsParPagination, validatorVotesPagination*nbElementsParPagination + nbElementsParPagination).map((valeur, index) => {
                                                    return <tr key={index}>
                                                        <td><Link to={"/validators/" + valeur[0]}>{valeur[1].description_moniker}</Link></td>
                                                        <td>{valeur[1].voting_power_pourcentage.toFixed(2)}&nbsp;%</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                        <div className='pagination'>
                                            <span>Page :</span>
                                            {Array(parseInt(Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).length/nbElementsParPagination) + ((Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).length/nbElementsParPagination)%1 > 0 ? 1 : 0)).fill(1).map((el, i) =>
                                                <span key={i} className={i === validatorVotesPagination ? 'paginationPageSelected' : 'paginationPageUnselected'} onClick={() => handleClickValidatorsVotesList(i)}>{i+1}</span>
                                            )}
                                        </div>
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
                                            <button className={filtre === "VOTE_OPTION_YES" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_YES")}><strong>YES</strong><span>(&nbsp;{proposalInfos['validator_VOTE_OPTION_YES']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_ABSTAIN" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_ABSTAIN")}><strong>ABSTAIN</strong><span>(&nbsp;{proposalInfos['validator_VOTE_OPTION_ABSTAIN']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_NO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO")}><strong>NO</strong><span>(&nbsp;{proposalInfos['validator_VOTE_OPTION_NO']}&nbsp;)<br />↓</span></button>
                                            <button className={filtre === "VOTE_OPTION_NO_WITH_VETO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO_WITH_VETO")}><strong>VETO</strong><span>(&nbsp;{proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']}&nbsp;)<br />↓</span></button>
                                        </div>
                                        <table className={styles.tblPendingValidatorsVotes}>
                                            <thead>
                                                <tr>
                                                    <th>Validator</th>
                                                    <th>Voting power</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(filtre === "VOTE_OPTION_YES" && proposalInfos['validator_VOTE_OPTION_YES'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted YES</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_ABSTAIN" && proposalInfos['validator_VOTE_OPTION_ABSTAIN'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted ABSTAIN</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_NO" && proposalInfos['validator_VOTE_OPTION_NO'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted NO</td>
                                                </tr> : null}
                                                {(filtre === "VOTE_OPTION_NO_WITH_VETO" && proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO'] === 0) ?
                                                <tr>
                                                    <td colSpan="2" className={styles.noVoteRow}>No validator voted NO WITH VETO</td>
                                                </tr> : null}

                                                {Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).sort((a, b) => {return b[1].voting_power_amount - a[1].voting_power_amount}).slice(validatorVotesPagination*nbElementsParPagination, validatorVotesPagination*nbElementsParPagination + nbElementsParPagination).map((valeur, index) => {
                                                    return<tr key={index}>
                                                        <td><Link to={"/validators/" + valeur[0]}>{valeur[1].description_moniker}</Link></td>
                                                        <td>{valeur[1].voting_power_pourcentage.toFixed(2)}&nbsp;%</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                        <div className='pagination'>
                                            <span>Page :</span>
                                            {Array(parseInt(Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).length/nbElementsParPagination) + ((Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).length/nbElementsParPagination)%1 > 0 ? 1 : 0)).fill(1).map((el, i) =>
                                                <span key={i} className={i === validatorVotesPagination ? 'paginationPageSelected' : 'paginationPageUnselected'} onClick={() => handleClickValidatorsVotesList(i)}>{i+1}</span>
                                            )}
                                        </div>
                                    </>
                                }
                            </div>
                        : null}
                        {(proposalInfos['status'] === 2) && proposalInfos['tblHistoriqueDesVotesValidateur'] && (proposalInfos['validator_VOTE_OPTION_YES'] + proposalInfos['validator_VOTE_OPTION_ABSTAIN'] + proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']) > 0 ?
                            <div className="boxContainer">
                                <h2 className={styles.h2titles}><strong>Validators votes & sentiment</strong></h2>
                                <div className={styles.comments}>
                                    <div className="textBrillant">
                                        <div><u>Proposal</u> : <strong>#{propID}</strong></div>
                                        <div><u>Validators vote turnout</u> : <strong>{proposalInfos['validator_VOTE_OPTION_YES'] + proposalInfos['validator_VOTE_OPTION_ABSTAIN'] + proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']}/{proposalInfos['validator_TOTAL_VOTES']}</strong> ({((proposalInfos['validator_VOTE_OPTION_YES'] + proposalInfos['validator_VOTE_OPTION_ABSTAIN'] + proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO'])/proposalInfos['validator_TOTAL_VOTES']*100).toFixed(2)}&nbsp;%&nbsp;of&nbsp;validators)</div>
                                        <div><u>Note</u> : total votes (validators + delegators) = {proposalInfos['pourcentageOfVoters'].toFixed(2)}&nbsp;%&nbsp;of&nbsp;VOTING&nbsp;POWER <strong><span className={proposalInfos['pourcentageOfVoters'] < proposalInfos['seuilDuQuorum'] ? "erreur" : "colore"}>{proposalInfos['pourcentageOfVoters'] < proposalInfos['seuilDuQuorum'] ? "(quorum not reached, but vote still in progress)" : "(quorum reached, but vote still in progress)"}</span></strong></div>
                                    </div>
                                </div>
                                <div className={styles.twoGraphs}>
                                    <div>
                                        <h3>Validators votes</h3>
                                        <div className={styles.comments}>(normally weighted votes)</div>
                                        <Chart
                                            type="pie"
                                            series={[proposalInfos['validator_VP_VOTED_YES'], proposalInfos['validator_VP_VOTED_ABSTAIN'], proposalInfos['validator_VP_VOTED_NOS']]}
                                            options={{
                                                labels: ['YES<br />' + proposalInfos['validator_VOTE_OPTION_YES'] + ' (' + proposalInfos['validator_VP_VOTED_YES'].toFixed(2) +'%)', 'ABSTAIN<br/>' + proposalInfos['validator_VOTE_OPTION_ABSTAIN'] + ' (' + proposalInfos['validator_VP_VOTED_ABSTAIN'].toFixed(2) +'%)', 'NO+VETO<br />' + (proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']) + ' (' + proposalInfos['validator_VP_VOTED_NOS'].toFixed(2) +'%)'],
                                                colors: ["#00D070", "#0090FF", "#FF5060"],          // Couleur des parts
                                                chart: {
                                                    foreColor: 'var(--primary-text-color)'          // Couleur des textes
                                                },
                                                legend: {
                                                    show: !0,
                                                    position: "bottom",
                                                }
                                            }}
                                        />
                                        <p className="textBrillant">This graph represents the <strong>validators votes</strong>, based on their real voting power</p>
                                    </div>
                                    <div>
                                        <h3>Validators sentiment</h3>
                                        <div className={styles.comments}>(votes without weighting)</div>
                                        <Chart
                                            type="pie"
                                            series={[proposalInfos['validator_VOTE_OPTION_YES'], proposalInfos['validator_VOTE_OPTION_ABSTAIN'], proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']]}
                                            options={{
                                                labels: ['YES<br />' + proposalInfos['validator_VOTE_OPTION_YES'] + ' (' + proposalInfos['validator_NB_VOTE_YES'].toFixed(2) +'%)', 'ABSTAIN<br />' + proposalInfos['validator_VOTE_OPTION_ABSTAIN'] + ' (' + proposalInfos['validator_NB_VOTE_ABSTAIN'].toFixed(2) +'%)', 'NO+VETO<br />' + (proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']) + ' (' + proposalInfos['validator_NB_VOTE_NOS'].toFixed(2) +'%)'],
                                                colors: ["#00D070", "#0090FF", "#FF5060"],          // Couleur des parts
                                                chart: {
                                                    foreColor: 'var(--primary-text-color)'          // Couleur des textes
                                                },
                                                legend: {
                                                    show: !0,
                                                    position: "bottom",
                                                }
                                            }}
                                        />
                                        <p className="textBrillant">This graph represents the <strong>validators sentiment</strong>, if all had the same voting power (hypothetical situation)</p>
                                    </div>
                                </div>
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
                                                <tr>
                                                    <td>{metEnFormeDateTime(proposalInfos['votingStartTime'])}</td>
                                                    <td colSpan="3">Voting opened at this date/time</td>
                                                </tr>
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
                                                <tr>
                                                    <td>{metEnFormeDateTime(proposalInfos['votingEndTime'])}</td>
                                                    <td colSpan="3">
                                                        {proposalInfos['status'] === 2 ?
                                                            '<== voting will end at this date/time'
                                                            :'Voting ended at this date/time'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>
                                }
                            </div>
                        : null}
                        {(proposalInfos['status'] === 2 || proposalInfos['status'] === 3 || proposalInfos['status'] === 4) && proposalInfos['tblHistoriqueDesVotesValidateur'] ?
                            <div className="boxContainer">
                                <h2 className={styles.h2titles}><strong>HISTORY of other votes</strong> (delegators)</h2>
                                {Object.keys(proposalInfos['tblHistoriqueDesVotesNonValidateur']).length === 0 ?
                                    <div><br />No data returned by the LCD, sorry.<br /><br /></div>
                                :
                                    <>
                                        <table className={styles.tblHistoricalNonValidatorsVotes}>
                                            <thead>
                                                <tr>
                                                    <th>Date/Time</th>
                                                    <th>Delegators</th>
                                                    <th>Votes (older to newer)</th>
                                                    <th>TxHash</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{metEnFormeDateTime(proposalInfos['votingStartTime'])}</td>
                                                    <td colSpan="3">Voting opened at this date/time</td>
                                                </tr>
                                                {proposalInfos['tblHistoriqueDesVotesNonValidateur'].map((valeur, index) => {
                                                    return <tr key={index}>
                                                        <td>{metEnFormeDateTime(valeur.datetime)}</td>
                                                        <td><Link to={"/accounts/" + valeur.terra1address}>{valeur.terra1address}</Link></td>
                                                        <td>
                                                            {valeur.vote === 'VOTE_OPTION_YES' ? <span className='textVoteYes'>YES</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_ABSTAIN' ? <span className='textVoteAbstain'>ABSTAIN</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_NO' ? <span className='textVoteNo'>NO</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_NO_WITH_VETO' ? <span className='textVoteNowithveto'>NO WITH VETO</span> : null}
                                                        </td>
                                                        <td><Link to={"/transactions/" + valeur.txhash}>{valeur.txhash}</Link></td>
                                                    </tr>
                                                })}
                                                <tr>
                                                    <td>{metEnFormeDateTime(proposalInfos['votingEndTime'])}</td>
                                                    <td colSpan="3">
                                                        {proposalInfos['status'] === 2 ?
                                                            '<== voting will end at this date/time'
                                                            :'Voting ended at this date/time'}
                                                    </td>
                                                </tr>
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