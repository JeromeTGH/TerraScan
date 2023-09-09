import React from 'react';
import styles from './BlockTxInfos.module.scss';
import { metEnFormeDateTime } from '../../application/AppUtils';
import { Link } from 'react-router-dom';
import StyledBox from '../../sharedComponents/StyledBox';

const BlockTxInfos = (props) => {
    
    return (
        <StyledBox title="Details" color="green">
            <table className={styles.tblInfos}>
                <tbody>
                    <tr>
                        <td>Date/Time :</td>
                        <td>{metEnFormeDateTime(props.txInfos['datetime'])}</td>
                    </tr>
                    <tr>
                        <td>Tx Hash :</td>
                        <td>{props.txHash}</td>
                    </tr>
                    <tr>
                        <td>Block height :</td>
                        <td><Link to={"/blocks/" + props.txInfos['blockHeight']}>{props.txInfos['blockHeight']}</Link></td>
                    </tr>
                    <tr>
                        <td>Nb of operations inside :</td>
                        <td>{props.txInfos['nbMessages']}</td>
                    </tr>
                    <tr>
                        <td>Gas (Used/Requested) :</td>
                        <td>{props.txInfos['gas_used']} / {props.txInfos['gas_wanted']}</td>
                    </tr>
                    <tr>
                        <td>Fees :</td>
                        <td>
                            {props.txInfos['feesAmountAndCoin'].map((element, index) => {
                                const sep = index === 0 ? "" : ", ";
                                return sep + element;
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td>Taxes :</td>
                        <td>
                            {props.txInfos['taxes']}
                        </td>
                    </tr>
                    <tr>
                        <td>Tx code (status) :</td>
                        <td>{props.txInfos['errCode']} {props.txInfos['errCode'] === '0' ? <span className="succes">(successful)</span> : <span>(failed)</span>}</td>
                    </tr>
                    {props.txInfos['errCode'] !== '0' ?
                        <tr>
                            <td>Err Message :</td>
                            <td><span className="erreur">{props.txInfos['errMessage']}</span></td>
                        </tr>
                    : null }
                </tbody>
            </table>
        </StyledBox>
    );
};

export default BlockTxInfos;