import React from 'react';
import styles from './BlockValLeft.module.scss';
import { formateLeNombre } from '../../application/AppUtils';
import { Link } from 'react-router-dom';
import { tblValidators } from '../../application/AppData';
import StyledBox from '../../sharedComponents/StyledBox';

const BlockValLeft = (props) => {
   
    // Affichage
    return (
        <StyledBox title="Details" color="orange" className={styles.detailsBlock}>
            <table className={styles.tblDetails}>
                <tbody>
                    <tr>
                        <td>Actual commission rate :</td>
                        <td>{tblValidators[props.valAddress].commission_actual_pourcentage}%</td>
                    </tr>
                    <tr>
                        <td>Voting power :</td>
                        <td>{tblValidators[props.valAddress].voting_power_pourcentage}%</td>
                    </tr>
                    {/* <tr>
                        <td>Nb of stakers (delegators) :</td>
                        <td>(not implemented)</td>
                    </tr> */}
                    <tr><td colSpan='2'>&nbsp;</td></tr>
                    <tr>
                        <td>Nb LUNC staked :</td>
                        <td>
                            {formateLeNombre(parseInt(tblValidators[props.valAddress].voting_power_amount/1000000), " ")},
                            <span className={styles.smallPart}>{((tblValidators[props.valAddress].voting_power_amount/1000000)%1).toFixed(6).replace('0.', '')}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Nb LUNC self-bonded :</td>
                        <td>
                            {formateLeNombre(parseInt(tblValidators[props.valAddress].self_delegation_amount/1000000), " ")},
                            <span className={styles.smallPart}>{((tblValidators[props.valAddress].self_delegation_amount/1000000)%1).toFixed(6).replace('0.', '')}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>% of self-bonded LUNC :</td>
                        <td>{tblValidators[props.valAddress].self_delegation_pourcentage}%</td>
                    </tr>
                    <tr><td colSpan='2'>&nbsp;</td></tr>
                    <tr>
                        <td>Max commission rate :</td>
                        <td>{tblValidators[props.valAddress].commission_max_pourcentage}%</td>
                    </tr>
                    <tr>
                        <td>Max change per day (com.) :</td>
                        <td>{tblValidators[props.valAddress].commission_max_change_pourcentage}%</td>
                    </tr>
                    <tr><td colSpan='2'>&nbsp;</td></tr>
                    <tr>
                        <td>Operator address :</td>
                        <td>{props.valAddress}</td>
                    </tr>
                    <tr>
                        <td>Account address :</td>
                        <td><Link to={"/accounts/" + tblValidators[props.valAddress].terra1_account_address}>{tblValidators[props.valAddress].terra1_account_address}</Link></td>
                    </tr>
                </tbody>
            </table>
        </StyledBox>
    );
};

export default BlockValLeft;