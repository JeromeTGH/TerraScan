import React, { useState } from 'react';
import styles from './_ShowProposals.module.scss';
import { Link } from 'react-router-dom';
import Card from './_Card';
import { tblProposals } from '../../application/AppData';

const ShowProposals = () => {

    // Variables React
    const [filtre, setFiltre] = useState("PROPOSAL_STATUS_VOTING_PERIOD");      // choix par défaut, pour afficher les votes en cours au démarrage

    // Fonction de sélection de filtre
    const handleClickOnFilter = (val) => {
        setFiltre(val);
    }

    // Affichage
    return (
        <div className={styles.blockProposals}>
            <div className={styles.tblFilters}>
                <button className={filtre === "ALL_PROPOSALS" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("ALL_PROPOSALS")}>Show ALL proposals</button>
                <button className={filtre === "PROPOSAL_STATUS_VOTING_PERIOD" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("PROPOSAL_STATUS_VOTING_PERIOD")}>Show VOTES in progress</button>
                <button className={filtre === "PROPOSAL_STATUS_DEPOSIT_PERIOD" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("PROPOSAL_STATUS_DEPOSIT_PERIOD")}>Show PENDING deposits</button>
                <button className={filtre === "PROPOSAL_STATUS_PASSED" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("PROPOSAL_STATUS_PASSED")}>Show ADOPTED proposals</button>
                <button className={filtre === "PROPOSAL_STATUS_REJECTED" ? styles.selectedFilter : ""} onClick={() => handleClickOnFilter("PROPOSAL_STATUS_REJECTED")}>Show REJECTED proposals</button>
            </div>
            <div className={styles.tblProposals}>
                {filtre === "ALL_PROPOSALS" ? tblProposals.map((element, index) => {
                    return <div key={index}><Link to={'/proposals/' + element.proposal_id}><Card card={element} /></Link></div>
                }) : null}
                {filtre === "PROPOSAL_STATUS_DEPOSIT_PERIOD" ? tblProposals.filter(element => (element.status === filtre)).map((element, index) => {
                    return <div key={index}><Link to={'/proposals/' + element.proposal_id}><Card card={element} /></Link></div>
                }) : null}
                {filtre === "PROPOSAL_STATUS_VOTING_PERIOD" ? tblProposals.filter(element => (element.status === filtre)).sort((a, b) => b.voting_start_time - a.voting_start_time).map((element, index) => {
                    return <div key={index}><Link to={'/proposals/' + element.proposal_id}><Card card={element} /></Link></div>
                }) : null}
                {(filtre === "PROPOSAL_STATUS_PASSED" || filtre === "PROPOSAL_STATUS_REJECTED") ? tblProposals.filter(element => (element.status === filtre)).sort((a, b) => b.voting_end_time - a.voting_end_time).map((element, index) => {
                    return <div key={index}><Link to={'/proposals/' + element.proposal_id}><Card card={element} /></Link></div>
                }) : null}
            </div>
        </div>
    );
};

export default ShowProposals;