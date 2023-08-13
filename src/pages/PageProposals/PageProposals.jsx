import React, { useEffect, useState } from 'react';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposals.module.scss';
import BlockGovernanceInfos from './BlockGovernanceInfos';
import BlockProposals from './BlockProposals';
import { getGovernanceInfos } from './getGovernanceInfos';
import { getProposals } from './getProposals';

const PageProposals = () => {

    // Variables React
    const [tableGovernanceInfos, setTableGovernanceInfos] = useState();
    const [msgErreurGovernanceInfos, setMsgErreurGovernanceInfos] = useState();

    const [tableProposals, setTableProposals] = useState();
    const [msgErreurProposals, setMsgErreurProposals] = useState();


    // Chargement au démarrage
    useEffect(() => {
        getGovernanceInfos().then((res) => {
            if(res['erreur']) {
                setMsgErreurGovernanceInfos(res['erreur']);
                setTableGovernanceInfos({});
            }
            else {
                setMsgErreurGovernanceInfos('');
                setTableGovernanceInfos(res);

                getProposals().then((res) => {
                    if(res['erreur']) {
                        setMsgErreurProposals(res['erreur']);
                        setTableProposals({});
                    }
                    else {
                        setMsgErreurProposals('');
                        setTableProposals(res);
                    }
                })
            }
        })
    }, [])


    // Affichage
    return (
        <>
            <h1><span><VoteIcon /><strong>Governance</strong> (rules & proposals)</span></h1>
            <br />
            <div className={styles.blocksProposalPage}>
                {msgErreurGovernanceInfos ? 
                    <div className="erreur boxContainer">{msgErreurGovernanceInfos}</div>
                    :
                    tableGovernanceInfos && tableGovernanceInfos['nbJoursMaxDeposit'] ?
                        <BlockGovernanceInfos tblGovernanceInfos={tableGovernanceInfos} />
                        :
                        <div className="boxContainer">Loading data from blockchain (lcd) ...</div>
                }
                {msgErreurProposals ? 
                    <div className="erreur boxContainer">{msgErreurProposals}</div>
                    :
                    tableProposals && (tableProposals.length > 0) ?
                        <BlockProposals tblProposals={tableProposals} tblGovernanceInfos={tableGovernanceInfos} />
                        :
                        <div className="boxContainer">Loading data from blockchain (lcd) ...</div>
                }
            </div>
        </>
    );
};

export default PageProposals;