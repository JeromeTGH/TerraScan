import React from 'react';
import styles from './_Staking.module.scss';
import { tblValidators } from '../../application/AppData';
import StyledBox from '../../sharedComponents/StyledBox';
import { ExchangeIcon, LockIcon, VoteIcon } from '../../application/AppIcons';
import { metEnFormeAmountPartieEntiere } from '../../application/AppUtils';

const Staking = (props) => {
   
    // Affichage
    return (
        <StyledBox title="Governance / Staking" color="orange" className={styles.stakingBlock}>
            <div className={styles.stakingInfos}>
                <div className={styles.stakingCol1}>
                    <div className={styles.stakingTitle}><VoteIcon />&nbsp;Voting power</div>
                    <div className={styles.stakingValue}>{tblValidators[props.valAddress].voting_power_pourcentage}%</div>
                </div>
                <div className={styles.stakingCol2}>
                    <div className={styles.stakingTitle}><LockIcon />&nbsp;Nb LUNC bonded</div>
                    <div className={styles.stakingValue}>{metEnFormeAmountPartieEntiere(tblValidators[props.valAddress].voting_power_amount/1000000)}</div>
                </div>
                <div className={styles.stakingCol3}>
                    <div className={styles.stakingTitle}><ExchangeIcon />&nbsp;Self bonded</div>
                    <div className={styles.stakingValue}>{metEnFormeAmountPartieEntiere(tblValidators[props.valAddress].self_delegation_amount/1000000)}</div>
                </div>
            </div>
        </StyledBox>
    );
};

export default Staking;