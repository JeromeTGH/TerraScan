import React, { useState } from 'react';
import styles from './BlockProposals.module.scss';
import { Link } from 'react-router-dom';
import { formateLeNombre, metEnFormeDateTime } from '../../application/AppUtils';
import { Coins } from '@terra-money/terra.js';
import { tblCorrespondanceValeurs } from '../../application/AppParams';

const BlockProposals = (props) => {

    // Variables React
    const [filtre, setFiltre] = useState(2);        // 2 = par défaut, on affiche les votes en cours

    // Fonction de sélection de filtre
    const handleClick = (val) => {
        // Valeur de "filtre" et statut associé :
        // 0 => all
        // 1 => PROPOSAL_STATUS_VOTING_PERIOD
        // 2 => PROPOSAL_STATUS_DEPOSIT_PERIOD
        // 3 => PROPOSAL_STATUS_PASSED
        // 4 => PROPOSAL_STATUS_REJECTED
        setFiltre(val);
    }

    // Affichage
    return (
        <div className={styles.blockProposals}>
            <table className={styles.tblFilters}>
                <tbody>
                    <tr>
                        <td className={filtre === 0 ? styles.selectedFilter : ""} onClick={() => handleClick(0)}>Show ALL proposals<br />↓</td>
                        <td className={filtre === 2 ? styles.selectedFilter : ""} onClick={() => handleClick(2)}>Show VOTES in progress<br />↓</td>
                        <td className={filtre === 1 ? styles.selectedFilter : ""} onClick={() => handleClick(1)}>Show PENDING deposits<br />↓</td>
                        <td className={filtre === 3 ? styles.selectedFilter : ""} onClick={() => handleClick(3)}>Show ADOPTED proposals<br />↓</td>
                        <td className={filtre === 4 ? styles.selectedFilter : ""} onClick={() => handleClick(4)}>Show REJECTED proposals<br />↓</td>
                    </tr>
                </tbody>
            </table>
            <div>
                {props.tblProposals.map((element, index) => {
                    return (
                        ((filtre === 0) || element.status === filtre) ?
                            <div className={"boxContainer " + styles.proposalBox} key={index}>
                                <table className={styles.tblProposals}>
                                    <tbody>
                                        <tr>
                                            <td>Proposal ID :</td>
                                            <td><Link to={"/proposals/"+element.id}>#{element.id} (see details)</Link></td>
                                        </tr>
                                        {element.status !== 1 ? <>
                                            <tr>
                                                <td>Voting start time :</td>
                                                <td>{metEnFormeDateTime(element.voting_start_time)}</td>
                                            </tr>
                                            <tr>
                                                <td>Voting end time :</td>
                                                <td>{metEnFormeDateTime(element.voting_end_time)}</td>
                                            </tr>
                                        </> : null}
                                        <tr>
                                            <td>Title :</td>
                                            <td>{element.content.title}</td>
                                        </tr>
                                        <tr>
                                            <td>Description :</td>
                                            <td>{element.content.description}</td>
                                        </tr>
                                        <tr>
                                            <td>Status :</td>
                                            <td>{proposalStatus[element.status]}</td>
                                        </tr>
                                        <tr>
                                            <td>Total deposit :</td>
                                            <td>{coinsListToFormatedText(element.total_deposit)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        : null
                    )
                })}
            </div>
        </div>
    );
};


const proposalStatus = {
    // -1: "UNRECOGNIZED"
    0: "???",                                       // PROPOSAL_STATUS_UNSPECIFIED
    1: "Waiting enough deposit (deposit period)",   // PROPOSAL_STATUS_DEPOSIT_PERIOD
    2: "Voting (voting period)",                    // PROPOSAL_STATUS_VOTING_PERIOD
    3: "Passed !",                                  // PROPOSAL_STATUS_PASSED
    4: "Rejected",                                  // PROPOSAL_STATUS_REJECTED
    // 5: "PROPOSAL_STATUS_FAILED"
}

const coinsListToFormatedText = (coinsList) => {
    const dataCoinsList = (new Coins(coinsList)).toData();
    let retour = "";
    
    if(dataCoinsList.length > 0) {
        for(let i=0 ; i < dataCoinsList.length ; i++) {
            const msgAmount = formateLeNombre(dataCoinsList[i].amount/1000000, ' ');
            const msgCoin = tblCorrespondanceValeurs[dataCoinsList[i].denom] ? tblCorrespondanceValeurs[dataCoinsList[i].denom] : dataCoinsList[i].denom;
            if(retour !== "")
                retour += ", ";
            retour += (msgAmount + "\u00a0" + msgCoin);
        }
    } else {
        retour = "---";
    }

    return retour;
}

export default BlockProposals;