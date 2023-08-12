import React from 'react';
import { VoteIcon } from '../../application/AppIcons';
import styles from './PageProposals.module.scss';

const PageProposals = () => {
    return (
        <>
            <h1><span><VoteIcon /><strong>Governance</strong> (rules & proposals)</span></h1>
            <br />
            <div className={styles.blocksProposalPage}>
                <p>Coming...</p>
                {/* <BlockInfos propID={propID} />
                <BlockProposals propID={propID} /> */}
            </div>
        </>
    );
};

export default PageProposals;