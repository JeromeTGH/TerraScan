import React, { useEffect, useState } from 'react';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposals.module.scss';
// import BlockGovernanceInfos from './BlockGovernanceInfos';
import BlockProposals from './BlockProposals';
import { getGovernanceInfos } from './getGovernanceInfos';
import { getProposals } from './getProposals';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';

const PageProposals = () => {

    // Variables React
    const [tableGovernanceInfos, setTableGovernanceInfos] = useState();
    const [msgErreurGovernanceInfos, setMsgErreurGovernanceInfos] = useState();

    const [tableProposals, setTableProposals] = useState();
    const [msgErreurProposals, setMsgErreurProposals] = useState();


    // Chargement au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Proposals - ' + appName;

        // Récupération de toutes les propositions
        getGovernanceInfos().then((res) => {
            if(res['erreur']) {
                setMsgErreurGovernanceInfos(res['erreur']);
                setTableGovernanceInfos({});
            }
            else {
                setMsgErreurGovernanceInfos('');
                setTableGovernanceInfos(res);

                getProposals(res).then((res2) => {
                    if(res2['erreur']) {
                        setMsgErreurProposals(res2['erreur']);
                        setTableProposals({});
                    }
                    else {
                        setMsgErreurProposals('');
                        setTableProposals(res2);
                    }
                })
            }
        })
    }, [])


    // Affichage
    return (
        <>
            <h1><span><VoteIcon /><strong>Proposals</strong></span></h1>
            <div className={styles.blocksProposalPage}>
                {msgErreurGovernanceInfos ?
                    <StyledBox title="ERROR" color="red"><div className='erreur'>{msgErreurGovernanceInfos}</div></StyledBox>
                :
                    null
                    // tableGovernanceInfos && tableGovernanceInfos['nbJoursMaxDeposit'] ?
                    //     <BlockGovernanceInfos tblGovernanceInfos={tableGovernanceInfos} />
                    //     :
                    //     <StyledBox title="Loading" color="blue">
                    //         <div>Loading data from blockchain (lcd), please wait ...</div>
                    //     </StyledBox>
                }
                {msgErreurProposals ?
                    <StyledBox title="ERROR" color="red"><div className='erreur'>{msgErreurProposals}</div></StyledBox>
                :
                    tableProposals && (tableProposals.length > 0) ?
                        <BlockProposals tblProposals={tableProposals} tblGovernanceInfos={tableGovernanceInfos} />
                    :
                        <StyledBox title="Loading" color="blue">
                            <div>Loading data from blockchain (lcd), please wait ...</div>
                        </StyledBox>
                }
            </div>
        </>
    );
};

export default PageProposals;