import React, { useState } from 'react';
import styles from './BlockProposals.module.scss';
import { useNavigate } from 'react-router-dom';
import ProposalCard from './ProposalCard';

const BlockProposals = (props) => {

    const navigate = useNavigate();

    // Variables React
    const [filtre, setFiltre] = useState(2);                // choix "2" par défaut, pour afficher les votes en cours au démarrage

    // Fonction de sélection de filtre
    const handleClickOnFilter = (val) => {
        // Valeur de "filtre" et statut associé :
        // 0 => all
        // 1 => PROPOSAL_STATUS_DEPOSIT_PERIOD
        // 2 => PROPOSAL_STATUS_VOTING_PERIOD
        // 3 => PROPOSAL_STATUS_PASSED
        // 4 => PROPOSAL_STATUS_REJECTED
        setFiltre(val);
    }

    // Fonction de navigation, pour voir le détail d'une proposition donnée
    const handleClickOnProposal = (propID) => {
        navigate('/proposals/' + propID);
    }

    // Affichage
    return (
        <div className={styles.blockProposals}>
            <div className={styles.tblFilters}>
                <button className={filtre === 0 ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter(0)}>Show ALL proposals<br />↓</button>
                <button className={filtre === 2 ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter(2)}>Show VOTES in progress<br />↓</button>
                <button className={filtre === 1 ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter(1)}>Show PENDING deposits<br />↓</button>
                <button className={filtre === 3 ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter(3)}>Show ADOPTED proposals<br />↓</button>
                <button className={filtre === 4 ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter(4)}>Show REJECTED proposals<br />↓</button>
            </div>
            <div className={styles.tblProposals}>
                {props.tblProposals.filter(element => (filtre === 0 || element.status === filtre)).map((element, index) => {

                    return <div key={index} onClick={() => handleClickOnProposal(element.id)}><ProposalCard card={element} /></div>

                })}
            </div>
        </div>
    );
};

export default BlockProposals;