import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
                            <p>Date creation : {metEnFormeDateTime(proposalInfos['submitDatetime'])}</p>
                            <p>Created by : <span className='colore'>(not implemented yet)</span></p>
                            <p>Status : <span className='colore'>{proposalInfos['statusText']}</span></p>
                        </div>
                        <p className="h2like"><strong>{proposalInfos['contentTitle']}</strong></p>
                        <p style={{whiteSpace: "pre-wrap"}}>{proposalInfos['contentDescription']}</p>
                        <br />
                        <hr />
                        <p>=====&gt; Building ...</p>
                        {/* <table className={styles.tblInfos}>
                            <tbody>
                                <tr>
                                    <td>Description</td>
                                    <td>{proposalInfos['contentDescription']}</td>
                                </tr>
                            </tbody>
                        </table> */}
                    </>
                        :
                        <div>Loading data from blockchain (lcd) ...</div>
                }
            </div>
        </>
    );
};

export default PageProposal;