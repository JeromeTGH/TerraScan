import React, { useEffect, useState } from 'react';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposals.module.scss';
import { getProposals } from './getProposals';
import StyledBox from '../../sharedComponents/StyledBox';
import Filters from './_Filters';
import TableOfProposals from './_TableOfProposals';

const PageProposals = (props) => {

    // Variables React
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();


    // Chargement au démarrage
    useEffect(() => {      
        // Récupération de toutes les propositions
        setIsLoading(true);
        getProposals().then((res) => {
            if(res['erreur']) {
                setMsgErreur(res['erreur']);
            }
            else {
                setMsgErreur('');
                setIsLoading(false);
            }
        })
    }, [])


    // Affichage
    return (
        <>
            <h1><span><VoteIcon /><strong>Proposals</strong></span></h1>
            <div className={styles.blocksProposalPage}>
                {msgErreur ?
                    <StyledBox title="ERROR" color="red"><div className='erreur'>{msgErreur}</div></StyledBox>
                :
                    isLoading ?
                        <StyledBox title="Loading" color="blue"><br /><div>Loading data from blockchain (lcd), please wait ...</div><br /></StyledBox>
                    :
                        <div className={styles.blockProposals}>
                            <Filters />
                            <TableOfProposals category={props.category} />
                        </div>
                }
            </div>
        </>
    );
};

export default PageProposals;