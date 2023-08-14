import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposal.module.scss';
import { getProposal } from './getProposal';
import { metEnFormeDateTime } from '../../application/AppUtils';


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
                            <p><u>Status</u> : <span><strong>{proposalInfos['statusText']}</strong></span></p>
                        </div>
                        <p className="h2like"><strong>{proposalInfos['contentTitle']}</strong></p>
                        <p style={{whiteSpace: "pre-wrap"}}>{proposalInfos['contentDescription']}</p>
                        <br />
                        {/* <table className={styles.tblInfos}>
                            <tbody>
                            <tr>
                            <td>Description</td>
                            <td>{proposalInfos['contentDescription']}</td>
                            </tr>
                            </tbody>
                        </table> */}
                        <hr />
                        <p>=====&gt; Not finished ...</p>
                    </>
                        :
                        <div>Loading data from blockchain (lcd) ...</div>
                }
            </div>
        </>
    );
};

export default PageProposal;