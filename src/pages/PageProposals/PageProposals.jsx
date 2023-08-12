import React from 'react';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposals.module.scss';
import BlockGovernanceInfos from './BlockGovernanceInfos';

const PageProposals = () => {
    return (
        <>
            <h1><span><VoteIcon /><strong>Governance</strong> (rules & proposals)</span></h1>
            <br />
            <div className={styles.blocksProposalPage}>
                <BlockGovernanceInfos />
            </div>
        </>
    );
};

export default PageProposals;