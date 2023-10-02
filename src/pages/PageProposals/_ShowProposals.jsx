import React, { useEffect, useState } from 'react';
import styles from './_ShowProposals.module.scss';
import { Link } from 'react-router-dom';
import Card from './_Card';
import { tblProposals } from '../../application/AppData';

const ShowProposals = () => {

    // Constantes
    const nbElementsAafficherParPage = 12;

    // Variables React
    const [filtre, setFiltre] = useState("PROPOSAL_STATUS_VOTING_PERIOD");      // choix par défaut, pour afficher les votes en cours au démarrage
    const [pagination, setPagination] = useState(0);

    const [nbreDePageTotal, setNbreDePageTotal] = useState(1);
    const [donneesAafficher, setDonneesAafficher] = useState(0);

    // Fonction de sélection de filtre
    const handleClickFiltering = (val) => {
        setPagination(0);
        setFiltre(val);
    }

    // Fonction de sélection de page
    const handleClickForPagination = (val) => {
        setPagination(val);
    }

    // Extraction des données qui nous intéresse, pour l'offichage
    useEffect(() => {
        const tblDonnees = [];

        switch(filtre) {
            case "ALL_PROPOSALS":
                tblDonnees.push(...tblProposals);
                break;
            case "PROPOSAL_STATUS_VOTING_PERIOD":
                tblDonnees.push(...tblProposals
                    .filter(element => (element.status === filtre))
                    .sort((a, b) => (b.voting_start_time > a.voting_start_time) ? 1 : ((b.voting_start_time < a.voting_start_time) ? -1 : 0)));
                break;
            case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
                tblDonnees.push(...tblProposals
                    .filter(element => (element.status === filtre)));
                break;
            case "PROPOSAL_STATUS_PASSED":
            case "PROPOSAL_STATUS_REJECTED":
                tblDonnees.push(...tblProposals
                    .filter(element => (element.status === filtre))
                    .sort((a, b) => (b.voting_end_time > a.voting_end_time) ? 1 : ((b.voting_end_time < a.voting_end_time) ? -1 : 0)));
                break;
            default:
                break;
        }

        setNbreDePageTotal(parseInt(tblDonnees.length/nbElementsAafficherParPage) + ((tblDonnees.length/nbElementsAafficherParPage)%1 > 0 ? 1 : 0));
        setDonneesAafficher(tblDonnees.slice(pagination*nbElementsAafficherParPage, pagination*nbElementsAafficherParPage + nbElementsAafficherParPage));

    }, [filtre, pagination])

    // Affichage
    return (
        <div className={styles.blockProposals}>
            <div className={styles.tblFilters}>
                <button className={filtre === "ALL_PROPOSALS" ? styles.selectedFilter : ""} onClick={() => handleClickFiltering("ALL_PROPOSALS")}>Show ALL proposals</button>
                <button className={filtre === "PROPOSAL_STATUS_VOTING_PERIOD" ? styles.selectedFilter : ""} onClick={() => handleClickFiltering("PROPOSAL_STATUS_VOTING_PERIOD")}>Show VOTES in progress</button>
                <button className={filtre === "PROPOSAL_STATUS_DEPOSIT_PERIOD" ? styles.selectedFilter : ""} onClick={() => handleClickFiltering("PROPOSAL_STATUS_DEPOSIT_PERIOD")}>Show PENDING deposits</button>
                <button className={filtre === "PROPOSAL_STATUS_PASSED" ? styles.selectedFilter : ""} onClick={() => handleClickFiltering("PROPOSAL_STATUS_PASSED")}>Show ADOPTED proposals</button>
                <button className={filtre === "PROPOSAL_STATUS_REJECTED" ? styles.selectedFilter : ""} onClick={() => handleClickFiltering("PROPOSAL_STATUS_REJECTED")}>Show REJECTED proposals</button>
            </div>
            <div className={styles.tblProposals}>
                {donneesAafficher ? donneesAafficher.map((element, index) => {
                    return <div key={index}>
                                <Link to={'/proposals/' + element.proposal_id}>
                                    <Card card={element} />
                                </Link>
                           </div>
                }) : null}
            </div>
            {nbreDePageTotal && nbreDePageTotal > 1 ?
                <div className='pagination'>
                    <span>Page :</span>
                    {Array(nbreDePageTotal).fill(1).map((el, i) =>
                        <span key={i} className={i === pagination ? 'paginationPageSelected' : 'paginationPageUnselected'} onClick={() => handleClickForPagination(i)}>{i+1}</span>
                    )}
                </div>
            : null}
        </div>
    );
};

export default ShowProposals;