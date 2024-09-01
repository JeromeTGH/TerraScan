import React, { useEffect, useState } from 'react';
import styles from './_TableOfProposals.module.scss';
import { Link } from 'react-router-dom';
import Card from './_Card';
import { tblProposals } from '../../application/AppData';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';

const TableOfProposals = (props) => {

    // Constantes
    const nbElementsAafficherParPage = 12;

    // Variables React
    const [pagination, setPagination] = useState(0);
    const [nbreDePageTotal, setNbreDePageTotal] = useState(1);
    const [donnees, setDonnees] = useState([]);
    const [donneesAafficher, setDonneesAafficher] = useState([]);


    // Fonction de sélection de page
    const handleClickForPagination = (val) => {
        setPagination(val);
    }

    // Extraction des données qui nous intéresse, pour l'offichage
    useEffect(() => {
        // Changement du "title" de la page web
        switch(props.category) {
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
        const filtre = filtreDenominations[props.category]

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
        setPagination(0);
        setDonnees(tblDonnees);
    }, [props.category])


    // Filtrage des données, selon pagination
    useEffect(() => {
        setDonneesAafficher(donnees.slice(pagination*nbElementsAafficherParPage, pagination*nbElementsAafficherParPage + nbElementsAafficherParPage));
    }, [donnees, pagination])

    // Affichage
    return (
        <>
            {donneesAafficher.length === 0 ?
                <StyledBox title="Proposals" color="blue">
                    <br />
                    {props.category === "deposits" ? <div>No proposal in deposit state, currently</div> : null}
                    {props.category === "voting" ? <div>No proposal in voting state, currently</div> : null}
                    {props.category === "deposits" && props.category !== "voting" ? <div>No proposal returned...</div> : null}
                    <br />
                </StyledBox>
            : null}
            <div className={styles.tblProposals}>
                {donneesAafficher ? donneesAafficher.map((element, index) => {
                    return <div key={index}>
                                <Link to={'/proposals/' + element.id}>
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