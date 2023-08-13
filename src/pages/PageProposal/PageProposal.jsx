import React from 'react';
import { useParams } from 'react-router-dom';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposal.module.scss';


const PageProposal = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { propID } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)


    // Affichage
    return (
        <>
            <h1><span><VoteIcon /><strong>Proposal</strong> #{propID}</span></h1>
            <br />
            <div className={styles.blocksProposalPage}>
                <p>Coming...</p>
                {/* <BlockInfos propID={propID} />
                <BlockProposals propID={propID} /> */}
            </div>
        </>
    );
};

export default PageProposal;