import React, { useEffect, useState } from 'react';
import styles from './_TableOfProposals.module.scss';
import { Link } from 'react-router-dom';
import Card from './_Card';
import { tblProposals } from '../../application/AppData';
import { appName } from '../../application/AppParams';

const TableOfProposals = (props) => {

    // Constantes
    const nbElementsAafficherParPage = 12;

    // Variables React
    const [pagination, setPagination] = useState(0);
    const [nbreDePageTotal, setNbreDePageTotal] = useState(1);
    const [donneesAafficher, setDonneesAafficher] = useState(0);


    // Fonction de sélection de page
    const handleClickForPagination = (val) => {
        setPagination(val);
    }

    // Extraction des données qui nous intéresse, pour l'offichage
    useEffect(() => {
        // Changement du "title" de la page web
        switch(props.filter) {
            case "voting":
                document.title = 'Voting proposals - ' + appName;
                break;
            case "deposits":
                document.title = 'Proposals deposits - ' + appName;
                break;
            case "adopted":
                document.title = 'Adopted proposals - ' + appName;
                break;
            case "rejected":
                document.title = 'Rejected proposals - ' + appName;
                break;
            case "all":
            default:
                document.title = 'Proposals - ' + appName;
        }


        // Filtrage des données
        const tblDonnees = [];

        const filtreDenominations = {
            all: "ALL_PROPOSALS",
            voting: "PROPOSAL_STATUS_VOTING_PERIOD",
            deposits: "PROPOSAL_STATUS_DEPOSIT_PERIOD",
            adopted: "PROPOSAL_STATUS_PASSED",
            rejected: "PROPOSAL_STATUS_REJECTED"
        }
        const filtre = filtreDenominations[props.filter]

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

    }, [props.filter, pagination])

    // Affichage
    return (
        <>
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
        </>
    );
};

export default TableOfProposals;