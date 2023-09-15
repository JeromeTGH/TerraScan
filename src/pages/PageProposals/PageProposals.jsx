import React, { useEffect, useState } from 'react';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposals.module.scss';
import ShowProposals from './_ShowProposals';
import { getProposals } from './getProposals';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';

const PageProposals = () => {

    // Variables React
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();


    // Chargement au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Proposals - ' + appName;

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
                        <ShowProposals />
                }
            </div>
        </>
    );
};

export default PageProposals;