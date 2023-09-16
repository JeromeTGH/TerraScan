import React from 'react';
import styles from './_Staking.module.scss';
import { tblGlobalInfos, tblValidators } from '../../application/AppData';
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
                            // Nota : je divise ici le nbre de lunc stakés sur ce validateur par le nbre total de LUNC stakés + les siens, pour obtenir le ratio de staking s'il revenait ACTIF
                            <>({(tblValidators[props.valAddress].voting_power_amount/(tblValidators[props.valAddress].voting_power_amount+tblGlobalInfos['nbStakedLunc'])*100).toFixed(2)}%)</>
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