import React, { useEffect, useState } from 'react';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposals.module.scss';
// import BlockGovernanceInfos from './BlockGovernanceInfos';
import BlockProposals from './BlockProposals';
import { getGovernanceInfos } from './getGovernanceInfos';
import { getProposals } from './getProposals';
import { appName } from '../../application/AppParams';

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
            <h1><span><VoteIcon /><strong>Governance</strong></span><span className={styles.txtAdd}> (rules & proposals)</span></h1>
            <br />
            <div className={styles.blocksProposalPage}>
                {msgErreurGovernanceInfos ?
                    <div className='styledBlocContainer'>
                        <div className='styledBlocContent'>
                            <div className='styledBlocTitleContainer'>
                                <div className='styledBlocTitleText styledRedBlock'>ERROR</div>
                            </div>
                            <div className='erreur'>{msgErreurGovernanceInfos}</div>
                        </div>
                    </div>
                    :
                    null
                    // tableGovernanceInfos && tableGovernanceInfos['nbJoursMaxDeposit'] ?
                    //     <BlockGovernanceInfos tblGovernanceInfos={tableGovernanceInfos} />
                    //     :
                    //     <div className='styledBlocContainer'>
                    //         <div className='styledBlocContent'>
                    //             <div className='styledBlocTitleContainer'>
                    //                 <div className='styledBlocTitleText styledBlueBlock'>Loading</div>
                    //             </div>
                    //             <div>Loading data from blockchain (lcd), please wait ...</div>
                    //         </div>
                    //     </div>
                }
                {msgErreurProposals ?
                    <div className='styledBlocContainer'>
                        <div className='styledBlocContent'>
                            <div className='styledBlocTitleContainer'>
                                <div className='styledBlocTitleText styledRedBlock'>ERROR</div>
                            </div>
                            <div className='erreur'>{msgErreurProposals}</div>
                        </div>
                    </div>
                    :
                    tableProposals && (tableProposals.length > 0) ?
                        <BlockProposals tblProposals={tableProposals} tblGovernanceInfos={tableGovernanceInfos} />
                        :
                        <div className='styledBlocContainer'>
                            <div className='styledBlocContent'>
                                <div className='styledBlocTitleContainer'>
                                    <div className='styledBlocTitleText styledBlueBlock'>Loading</div>
                                </div>
                                <div>Loading data from blockchain (lcd), please wait ...</div>
                            </div>
                        </div>
                }
            </div>
        </>
    );
};

export default PageProposals;