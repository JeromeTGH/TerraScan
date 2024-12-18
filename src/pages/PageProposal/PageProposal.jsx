import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EyeIcon, VoteIcon } from '../../application/AppIcons';
import styles from './PageProposal.module.scss';
import { getProposal } from './getProposal';
import { Urlify, expanded_datetime_ago, metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';
import ObjectViewer from '../../sharedComponents/ObjectViewer';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css'
// import Chart from 'react-apexcharts';
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
    
    // const [metaDataInfos, setMetaDataInfos] = useState();

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

    // // Fonction de récupération des metaInfos IPFS, si il y a
    // const getMetaDatas = async (metadatas) => {

    //     const ipfsRegex = new RegExp('^ipfs://[A-Za-z0-9]+$');
    //     if(ipfsRegex.test(metadatas)) {
    //         const ipfsAdr = 'https://ipfs.io/ipfs/' + metadatas.replace('ipfs://', '');
    //         const ipfsData = await getIpfsData(ipfsAdr);
    //         setMetaDataInfos(ipfsData);
    //     } else {
    //         setMetaDataInfos("link");
    //     }
      
    // }


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

                // Fixation du filtre par défaut, suivant le type de status de proposition
                if(res['status'] === "PROPOSAL_STATUS_PASSED" || res['status'] === "PROPOSAL_STATUS_REJECTED")
                    setFiltre("VOTE_OPTION_YES");          
                if(res['status'] === "PROPOSAL_STATUS_VOTING_PERIOD")
                    setFiltre("DID_NOT_VOTE");
                
                // Et transmission des données, pour mise à jour ici
                setProposalInfos(res);

                // Chargement des infos IPFS, si il y en a
                // getMetaDatas(res["metadataField"]);

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
                    <StyledBox title="ERROR" color="red"><div className='erreur'>{msgErreur}</div></StyledBox>
                    :
                    proposalInfos && proposalInfos['contentDescription'] ?
                    <>
                        <div className={styles.headInfos}>
                            <div><u>Creation date/time</u> : {metEnFormeDateTime(proposalInfos['submitDatetime'])}</div>
                            <div><u>Created by</u> : {
                                proposalInfos['proposerValAddress'] ?
                                    <>
                                        <Link to={"/validators/" + proposalInfos['proposerValAddress']}>{proposalInfos['proposerValMoniker']}</Link>
                                        <div><u>Through his account</u> : <Link to={"/accounts/" + proposalInfos['proposerAddress']}>{proposalInfos['proposerAddress']}</Link></div>
                                    </>
                                :
                                    proposalInfos['proposerAddress'] ?
                                        <Link to={"/accounts/" + proposalInfos['proposerAddress']}>{proposalInfos['proposerAddress']}</Link>
                                    :
                                        <span>(unknown)</span>
                                }
                            </div>
                            <div><u>Type</u> : {proposalInfos['propType']}</div>
                        </div>
                        <br />
                        <div>Status : {proposalInfos['status'] === "PROPOSAL_STATUS_PASSED" ?
                            <span className='succes'><strong>{proposalInfos['statusText']}</strong></span>
                            :
                            proposalInfos['status'] === "PROPOSAL_STATUS_REJECTED" ?
                                <span className='erreur'><strong>{proposalInfos['statutVote']}</strong></span>
                                :
                                <span className='colore'><strong>{proposalInfos['statusText']}</strong></span>
                            }
                        </div>


                        <StyledBox title="Proposal" color="green">
                            <h2 className={styles.h2titles}><strong>{proposalInfos['contentTitle']}</strong></h2>
                            <p className={styles.contentDescription}>
                                <Urlify text={proposalInfos['contentDescription']} />
                            </p>
                        </StyledBox>


                        {/* {proposalInfos['metadataField'] && proposalInfos['ipfsDatas'] ?
                            <StyledBox title="Metadata" color="brown">
                                <div className={styles.addContent}>{proposalInfos['metadataField']}</div>
                            </StyledBox>
                        : null} */}
                        
                        {/* {proposalInfos['metadataField'] ?
                            <StyledBox title="Metadata" color="brown">
                                {!metaDataInfos ?
                                    <div className={styles.formatedMetadata}>Loading...</div>
                                :
                                    metaDataInfos === "link" ?
                                        <div className={styles.formatedMetadata}>{proposalInfos['metadataField']}</div>
                                    :
                                        <div className={styles.formatedMetadata}>
                                            <pre>{JSON.stringify(metaDataInfos, null, 2)}</pre>
                                        </div>
                                }
                            </StyledBox>                         
                        : null} */}

                        {proposalInfos['propMsgs'] && proposalInfos['propMsgs'].length > 0 ?
                            <StyledBox title={proposalInfos['propMsgs'].length > 1 ? "Messages" : "Message"} color="brown">
                                <div className={styles.addContent}>
                                    <JsonView src={proposalInfos['propMsgs']} />
                                </div>
                            </StyledBox>
                        : null}
                        {proposalInfos['propType'].includes('MsgCommunityPoolSpend') ?
                            <StyledBox title="Community Pool spend" color="purple">
                                <div className={styles.addContent}>
                                    <p><strong>Amount</strong> : {proposalInfos['propAmount']}</p>
                                    <br />
                                    <p><strong>Autority</strong>&nbsp;:&nbsp;<Link to={'/accounts/' + proposalInfos['contentAutority']}>{proposalInfos['contentAutority']}</Link></p>
                                    <p><strong>Recipient</strong>&nbsp;:&nbsp;<Link to={'/accounts/' + proposalInfos['contentRecipient']}>{proposalInfos['contentRecipient']}</Link></p>
                                </div>
                            </StyledBox>
                        : null}
                        {(proposalInfos['contentAmount'] && proposalInfos['contentRecipient']) ?
                            <StyledBox title="Send" color="purple">
                                <div className={styles.addContent}>
                                    <p><strong>Amount</strong> : {proposalInfos['contentAmount']}</p>
                                    <p><strong>To</strong>&nbsp;:&nbsp;<Link to={'/accounts/' + proposalInfos['contentRecipient']}>{proposalInfos['contentRecipient']}</Link></p>
                                </div>
                            </StyledBox>
                        : null}
                        {proposalInfos['contentChanges'] ?
                            <StyledBox title="Changes" color="purple">
                                <ObjectViewer objetAvisualiser={proposalInfos['contentChanges']} className={styles.addContent} />
                                {/* <div className={styles.addContent}><pre>{JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(proposalInfos['contentChanges'], null, 2))), null, 2)}</pre></div> */}
                            </StyledBox>
                        : null}
                        {proposalInfos['contentPlan'] ?
                            <StyledBox title="Plan" color="purple">
                                <ObjectViewer objetAvisualiser={proposalInfos['contentPlan']} className={styles.addContent} />
                                {/* <div className={styles.addContent}><pre>{JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(proposalInfos['contentPlan'], null, 2))), null, 2)}</pre></div> */}
                            </StyledBox>
                        : null}
                        {proposalInfos['ClientUpdateProposal'] ?
                            <StyledBox title="Update proposal" color="purple">
                                <div className={styles.addContent}>
                                    <p><strong>Subject_client_id</strong>&nbsp;= {proposalInfos['ClientUpdateProposal'][0]}</p>
                                    <p><strong>Substitute_client_id</strong>&nbsp;= {proposalInfos['ClientUpdateProposal'][1]}</p>
                                </div>
                            </StyledBox>
                        : null}

                        {proposalInfos['status'] === "PROPOSAL_STATUS_DEPOSIT_PERIOD" ?
                            <>
                                <StyledBox title="Votes (pending for enough deposits)" color="orange">
                                    <table className={styles.tblInfos}>
                                        <tbody>
                                            <tr>
                                                <td>Proposal ID :</td>
                                                <td>{propID}</td>
                                            </tr>
                                            <tr>
                                                <td>Amount of LUNC required :</td>
                                                <td>
                                                    <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(proposalInfos['nbMinDepositLunc'])}</span>
                                                    <span className='partieDecimale'>{retournePartieDecimaleFixed6(proposalInfos['nbMinDepositLunc'])}</span>
                                                    <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Amount of LUNC deposited :</td>
                                                <td>
                                                    <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(proposalInfos['totalDeposit'])}</span>
                                                    <span className='partieDecimale'>{retournePartieDecimaleFixed6(proposalInfos['totalDeposit'])}</span>
                                                    <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Ratio deposited/required :</td>
                                                <td>{proposalInfos['pourcentageDeLuncFournisSurRequis'].toFixed(2)}%</td>
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
                                </StyledBox>
                                <StyledBox title="Deposits (per accounts)" color="blue">
                                    <table className={styles.tblDeposits}>
                                        <tbody>
                                            {proposalInfos['deposits'].length === 0 ? 
                                                <tr>
                                                    <td colSpan="2">No data</td>
                                                </tr>
                                            :
                                                proposalInfos['deposits'].map((element, index) => {
                                                    return <tr key={index}>
                                                        <td><Link to={"/accounts/" + element.depositor}>{element.depositor}</Link></td>
                                                        {element.amount.map((element2, index2) => {
                                                            return element2.denom === 'uluna' ?
                                                                <td key={index2}>
                                                                    <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element2.amount/1000000)}</span>
                                                                    <span className='partieDecimale'>{retournePartieDecimaleFixed6(element2.amount/1000000)}</span>
                                                                    <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                                                </td>
                                                            :
                                                                null
                                                        })}
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </StyledBox>
                            </>
                        : null}
                        {proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD" ?
                            <StyledBox title="Votes (in progress)" color="orange">
                                <div className={styles.infos}>
                                    <div><strong>Proposal ID</strong> : #{propID}</div>
                                    <div><strong>Voting start time</strong> : {metEnFormeDateTime(proposalInfos['votingStartTime'])}</div>
                                </div>
                                <br />
                                <div className={styles.tblVotes}>
                                    <div className={styles.yesVote}>
                                        <div>YES</div>
                                        <div>{proposalInfos['pourcentageOfYes'].toFixed(2)}%</div>
                                        <div>{(proposalInfos['nbVotesYesLunc']/1000000) > 1 ? metEnFormeAmountPartieEntiere(proposalInfos['nbVotesYesLunc']/1000000) + '\u00a0LUNC' : '-'}</div>
                                    </div>
                                    <div className={styles.abstainVote}>
                                        <div>ABSTAIN</div>
                                        <div>{proposalInfos['pourcentageOfAbstain'].toFixed(2)}%</div>
                                        <div>{(proposalInfos['nbVotesAbstainLunc']/1000000) > 1 ? metEnFormeAmountPartieEntiere(proposalInfos['nbVotesAbstainLunc']/1000000) + '\u00a0LUNC' : '-'}</div>
                                    </div>
                                    <div className={styles.noVote}>
                                        <div>NO</div>
                                        <div>{proposalInfos['pourcentageOfNo'].toFixed(2)}%</div>
                                        <div>{(proposalInfos['nbVotesNoLunc']/1000000) > 1 ? metEnFormeAmountPartieEntiere(proposalInfos['nbVotesNoLunc']/1000000) + '\u00a0LUNC' : '-'}</div>
                                    </div>
                                    <div className={styles.vetoVote}>
                                        <div>VETO</div>
                                        <div>{proposalInfos['pourcentageOfNoWithVeto'].toFixed(2)}%</div>
                                        <div>{(proposalInfos['nbVotesNowithvetoLunc']/1000000) > 1 ? metEnFormeAmountPartieEntiere(proposalInfos['nbVotesNowithvetoLunc']/1000000) + '\u00a0LUNC' : '-'}</div>
                                    </div>
                                </div>
                                <table className={styles.votesTable}>
                                    <tbody>
                                        <tr>
                                            <td>Votes :</td>
                                            {proposalInfos['isQuorumReached'] ? 
                                                proposalInfos['isVetoReached'] ?
                                                    <td>
                                                        <div className={styles.vetoCursor} style={{ width: proposalInfos['seuilVeto']*2 + "%"}}>
                                                            <div style={{textAlign: 'center'}}>VETO Threshold</div>
                                                            <div>|</div>
                                                        </div>
                                                        <div className={styles.supportBar}>
                                                            <div style={{ width: proposalInfos['pourcentageOfNoWithVeto'] + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                                            <div style={{ width: proposalInfos['pourcentageOfNo'] + "%"}} className='barVoteNo'>&nbsp;</div>
                                                            <div style={{ width: proposalInfos['pourcentageOfYes'] + "%"}} className='barVoteYes'>&nbsp;</div>
                                                            <div style={{ width: proposalInfos['pourcentageOfAbstain'] + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                                        </div>
                                                    </td>
                                                :
                                                    <td>
                                                        <div className={styles.voteCursor} style={{ width: proposalInfos['seuilAcceptation']*2 + "%"}}>
                                                            <div>Threshold</div>
                                                            <div>|</div>
                                                        </div>
                                                        <div className={styles.supportBar}>
                                                            <div style={{ width: proposalInfos['pourcentageOfYes'] + "%"}} className='barVoteYes'>&nbsp;</div>
                                                            <div style={{ width: proposalInfos['pourcentageOfNo'] + "%"}} className='barVoteNo'>&nbsp;</div>
                                                            <div style={{ width: proposalInfos['pourcentageOfNoWithVeto'] + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                                            <div style={{ width: proposalInfos['pourcentageOfAbstain'] + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                                        </div>
                                                    </td>         
                                                :
                                                <td>
                                                    <div className={styles.quorumCursor} style={{ width: proposalInfos['seuilQuorum']*2 + "%"}}>
                                                        <div>Quorum</div>
                                                        <div>|</div>
                                                    </div>
                                                    <div className={styles.supportBar}>
                                                        <div style={{ width: proposalInfos['pourcentageOfYes'] + "%"}} className='barVoteYes'>&nbsp;</div>
                                                        <div style={{ width: proposalInfos['pourcentageOfNo'] + "%"}} className='barVoteNo'>&nbsp;</div>
                                                        <div style={{ width: proposalInfos['pourcentageOfNoWithVeto'] + "%"}} className='barVoteNowithveto'>&nbsp;</div>
                                                        <div style={{ width: proposalInfos['pourcentageOfAbstain'] + "%"}} className='barVoteAbstain'>&nbsp;</div>
                                                    </div>
                                                </td>
                                            }
                                        </tr>
                                        <tr>
                                            <td>Vote period :</td>
                                            <td>
                                                <div className={styles.supportBar}>
                                                    <div style={{ width: proposalInfos['pourcentageOfVotePeriod'] + "%"}} className='barNeutral'>&nbsp;</div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className={styles.status}><span className='colore'><strong>{proposalInfos['statutVote']}</strong></span></div>
                                <br />
                                <div className={styles.note}>Note : this vote will approximatively <strong>end in {expanded_datetime_ago(proposalInfos['votingEndTime'], true)}</strong> ({metEnFormeDateTime(proposalInfos['votingEndTime'])})</div>
                            </StyledBox>
                        : null}
                        {(proposalInfos['status'] === "PROPOSAL_STATUS_PASSED" || proposalInfos['status'] === "PROPOSAL_STATUS_REJECTED") ?
                            <StyledBox title="Votes (voting complete)" color="orange">
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
                                                {proposalInfos['status'] === "PROPOSAL_STATUS_PASSED" ?
                                                    <span className='succes'><strong>{proposalInfos['statutVote']}</strong></span>
                                                :
                                                    proposalInfos['isVetoReached'] ?
                                                        <span className='textVoteNowithveto'><strong>{proposalInfos['statutVote']}</strong></span>
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
                            </StyledBox>
                        : null}

                        {proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD" && proposalInfos['tblDesVotesDeValidateur'] ?
                            <StyledBox title="Validators votes" color="blue">
                                {Object.keys(proposalInfos['tblDesVotesDeValidateur']).length === 0 ?
                                    <div>No data returned by the blockchain (lcd), sorry.</div>
                                :
                                    <>
                                        <br />
                                        <div className={styles.tblPendingVotesFilter}>
                                            <button className={filtre === "DID_NOT_VOTE" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("DID_NOT_VOTE")}><strong>Did not vote</strong>&nbsp;({proposalInfos['validator_DID_NOT_VOTE']})</button>
                                            <button className={filtre === "VOTE_OPTION_YES" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_YES")}><strong>YES</strong>&nbsp;({proposalInfos['validator_VOTE_OPTION_YES']})</button>
                                            <button className={filtre === "VOTE_OPTION_ABSTAIN" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_ABSTAIN")}><strong>ABSTAIN</strong>&nbsp;({proposalInfos['validator_VOTE_OPTION_ABSTAIN']})</button>
                                            <button className={filtre === "VOTE_OPTION_NO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO")}><strong>NO</strong>&nbsp;({proposalInfos['validator_VOTE_OPTION_NO']})</button>
                                            <button className={filtre === "VOTE_OPTION_NO_WITH_VETO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO_WITH_VETO")}><strong>VETO</strong>&nbsp;({proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']})</button>
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
                                        {((filtre === "DID_NOT_VOTE" && proposalInfos['validator_DID_NOT_VOTE'] !== 0) ||
                                            (filtre === "VOTE_OPTION_YES" && proposalInfos['validator_VOTE_OPTION_YES'] !== 0) ||
                                            (filtre === "VOTE_OPTION_ABSTAIN" && proposalInfos['validator_VOTE_OPTION_ABSTAIN'] !== 0) ||
                                            (filtre === "VOTE_OPTION_NO" && proposalInfos['validator_VOTE_OPTION_NO'] !== 0) ||
                                            (filtre === "VOTE_OPTION_NO_WITH_VETO" && proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO'] !== 0)) ?
                                            <div className='pagination'>
                                                <span>Page :</span>
                                                {Array(parseInt(Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).length/nbElementsParPagination) + ((Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).length/nbElementsParPagination)%1 > 0 ? 1 : 0)).fill(1).map((el, i) =>
                                                    <span key={i} className={i === validatorVotesPagination ? 'paginationPageSelected' : 'paginationPageUnselected'} onClick={() => handleClickValidatorsVotesList(i)}>{i+1}</span>
                                                )}
                                            </div>
                                        : null }
                                    </>
                                }
                                {/* {(proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD") && proposalInfos['tblHistoriqueDesVotesValidateur'] && (proposalInfos['validator_VOTE_OPTION_YES'] + proposalInfos['validator_VOTE_OPTION_ABSTAIN'] + proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']) > 0 ?
                                    <>
                                        <br />
                                        <div className={styles.comments}>
                                            <div className="textBrillant">
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
                                    </>
                                : null} */}
                            </StyledBox>
                        : null}
                        {/* {(proposalInfos['status'] === "PROPOSAL_STATUS_PASSED" || proposalInfos['status'] === "PROPOSAL_STATUS_REJECTED") && proposalInfos['tblDesVotesDeValidateur'] ?
                            <StyledBox title="Validators votes" color="blue">
                                {Object.keys(proposalInfos['tblDesVotesDeValidateur']).length === 0 ?
                                    <div><br />No data returned by the blockchain (lcd), sorry.<br /><br /></div>
                                :
                                    <>
                                        <br />
                                        <div className={styles.tblClosedVotesFilter}>
                                            <button className={filtre === "VOTE_OPTION_YES" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_YES")}><strong>YES</strong>&nbsp;({proposalInfos['validator_VOTE_OPTION_YES']})</button>
                                            <button className={filtre === "VOTE_OPTION_ABSTAIN" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_ABSTAIN")}><strong>ABSTAIN</strong>&nbsp;({proposalInfos['validator_VOTE_OPTION_ABSTAIN']})</button>
                                            <button className={filtre === "VOTE_OPTION_NO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO")}><strong>NO</strong>&nbsp;({proposalInfos['validator_VOTE_OPTION_NO']})</button>
                                            <button className={filtre === "VOTE_OPTION_NO_WITH_VETO" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("VOTE_OPTION_NO_WITH_VETO")}><strong>VETO</strong>&nbsp;({proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']})</button>
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
                                        {((filtre === "VOTE_OPTION_YES" && proposalInfos['validator_VOTE_OPTION_YES'] !== 0) ||
                                            (filtre === "VOTE_OPTION_ABSTAIN" && proposalInfos['validator_VOTE_OPTION_ABSTAIN'] !== 0) ||
                                            (filtre === "VOTE_OPTION_NO" && proposalInfos['validator_VOTE_OPTION_NO'] !== 0) ||
                                            (filtre === "VOTE_OPTION_NO_WITH_VETO" && proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO'] !== 0)) ?
                                            <div className='pagination'>
                                                <span>Page :</span>
                                                {Array(parseInt(Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).length/nbElementsParPagination) + ((Object.entries(proposalInfos['tblDesVotesDeValidateur']).filter(element => element[1].vote === filtre).length/nbElementsParPagination)%1 > 0 ? 1 : 0)).fill(1).map((el, i) =>
                                                    <span key={i} className={i === validatorVotesPagination ? 'paginationPageSelected' : 'paginationPageUnselected'} onClick={() => handleClickValidatorsVotesList(i)}>{i+1}</span>
                                                )}
                                            </div>
                                        : null}
                                    </>
                                }
                            </StyledBox>
                        : null} */}
                        {(proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD") && proposalInfos['tblHistoriqueDesVotesValidateur'] ?
                            <StyledBox title="HISTORY of validators votes" color="green">
                                {Object.keys(proposalInfos['tblHistoriqueDesVotesValidateur']).length === 0 ?
                                    <div><br />No data returned by the blockchain (lcd), sorry.<br /><br /></div>
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
                                                    <th>Tx</th>
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
                                                        <td>
                                                            <Link to={"/validators/" + valeur.valoperaddress}><strong>{valeur.valmoniker}</strong></Link>{valeur.version > 0 ? <span className={styles.voteVersion}> (vote #{valeur.version})</span> : null}
                                                            <br />
                                                            <span className={styles.votingpower}>VP&nbsp;:&nbsp;<strong>{valeur.voting_power_pourcentage}</strong>&nbsp;%</span>
                                                            {valeur.memo && valeur.memo !== "" ?
                                                                <>
                                                                    <br />
                                                                    <span className={styles.memofield}>Memo&nbsp;:&nbsp;<strong>{valeur.memo}</strong></span>
                                                                </>
                                                            : null}
                                                        </td>
                                                        <td>
                                                            {valeur.vote === 'VOTE_OPTION_YES' ? <span className='textVoteYes'>YES</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_ABSTAIN' ? <span className='textVoteAbstain'>ABSTAIN</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_NO' ? <span className='textVoteNo'>NO</span> : null}
                                                            {valeur.vote === 'VOTE_OPTION_NO_WITH_VETO' ? <span className='textVoteNowithveto'>NO WITH VETO</span> : null}
                                                        </td>
                                                        <td className={styles.view}><Link to={"/transactions/" + valeur.txhash}><EyeIcon /></Link></td>
                                                    </tr>
                                                })}
                                                <tr>
                                                    <td>{metEnFormeDateTime(proposalInfos['votingEndTime'])}</td>
                                                    <td colSpan="3">
                                                        {proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD" ?
                                                            '<== voting will end at this date/time'
                                                            :'Voting ended at this date/time'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>
                                }
                            </StyledBox>
                        : null}
                        {/* {(proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD" || proposalInfos['status'] === "PROPOSAL_STATUS_PASSED" || proposalInfos['status'] === "PROPOSAL_STATUS_REJECTED") && proposalInfos['tblHistoriqueDesVotesValidateur'] ?
                            <StyledBox title="HISTORY of other votes (delegators)" color="green">
                                {Object.keys(proposalInfos['tblHistoriqueDesVotesNonValidateur']).length === 0 ?
                                    <div><br />No data returned by the blockchain (lcd), sorry.<br /><br /></div>
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
                                                        {proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD" ?
                                                            '<== voting will end at this date/time'
                                                            :'Voting ended at this date/time'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>
                                }
                            </StyledBox>
                        : null} */}
                    </>
                :
                    <StyledBox title="Loading" color="blue"><br /><div>Loading data from blockchain (lcd), please wait ...</div><br /></StyledBox>
                }
            </div>
        </>
    );
};

export default PageProposal;