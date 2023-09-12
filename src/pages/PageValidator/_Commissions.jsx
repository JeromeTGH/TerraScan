import React from 'react';
import styles from './_Commissions.module.scss';
import { tblValidators } from '../../application/AppData';
import StyledBox from '../../sharedComponents/StyledBox';


const Commissions = (props) => {
   
    // Affichage
    return (
        <StyledBox title="Commissions" color="purple" className={styles.commissionsBlock}>
            <div className={styles.commissionsInfos}>
                <div className={styles.commissionsCol1}>
                    <div className={styles.commissionsTitle}>Actual commission</div>
                    <div className={styles.commissionsValue}>{tblValidators[props.valAddress].commission_actual_pourcentage}%</div>
                </div>
                <div className={styles.commissionsCol2}>
                    <div className={styles.commissionsTitle}>Max commission</div>
                    <div className={styles.commissionsValue}>{tblValidators[props.valAddress].commission_max_pourcentage}%</div>
                </div>
                <div className={styles.commissionsCol3}>
                    <div className={styles.commissionsTitle}>Max daily change</div>
                    <div className={styles.commissionsValue}>{tblValidators[props.valAddress].commission_max_change_pourcentage}%</div>
                </div>
            </div>
        </StyledBox>
    );
};

export default Commissions;