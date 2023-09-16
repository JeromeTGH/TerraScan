import React from 'react';
import styles from './_Staking.module.scss';
import { tblValidators } from '../../application/AppData';
import StyledBox from '../../sharedComponents/StyledBox';
import { metEnFormeAmountPartieEntiere } from '../../application/AppUtils';

const Staking = (props) => {
   
    // Affichage
    return (
        <StyledBox title="Governance / Staking" color="orange" className={styles.stakingBlock}>
            <div className={styles.stakingInfos}>
                <div className={styles.stakingCol1}>
                    <div className={styles.stakingTitle}>Voting power</div>
                    <div className={styles.stakingValue}>
                        {tblValidators[props.valAddress].status === 'active' ?
                            <>{tblValidators[props.valAddress].voting_power_pourcentage}%</>
                            :
                            <>({tblValidators[props.valAddress].voting_power_pourcentage.toFixed(2)}%)</>
                        }
                    </div>
                </div>
                <div className={styles.stakingCol2}>
                    <div className={styles.stakingTitle}>Delegated LUNC</div>
                    <div className={styles.stakingValue}>{metEnFormeAmountPartieEntiere(tblValidators[props.valAddress].voting_power_amount/1000000)}</div>
                </div>
                <div className={styles.stakingCol3}>
                    <div className={styles.stakingTitle}>Self bonded LUNC</div>
                    <div className={styles.stakingValue}>{metEnFormeAmountPartieEntiere(tblValidators[props.valAddress].self_delegation_amount/1000000)}</div>
                </div>
            </div>
        </StyledBox>
    );
};

export default Staking;