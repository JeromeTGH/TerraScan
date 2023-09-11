import React from 'react';
import styles from './BlockTxInfos.module.scss';
import { metEnFormeDateTime } from '../../application/AppUtils';
import { Link } from 'react-router-dom';
import StyledBox from '../../sharedComponents/StyledBox';
import { BlocksIcon, BurnIcon, CashIcon, CoinsIcon, ExchangeIcon, TimeIcon } from '../../application/AppIcons';

const BlockTxInfos = (props) => {
    
    return (
        <>
            {props.txInfos['errCode'] !== '0' ?
                <StyledBox title="Failed" color="red"><span className="erreur">{props.txInfos['errMessage']}</span></StyledBox>
            : null }
            <StyledBox title="Details" color="green">
                <div className={styles.txOverflow}>
                    <div className={styles.txInfos}>
                        <div className={styles.txDatetime}>
                            <div className={styles.txTitle}><TimeIcon />&nbsp;Date&nbsp;&&nbsp;Time</div>
                            <div className={styles.txValue}>{metEnFormeDateTime(props.txInfos['datetime'])}</div>
                        </div>
                        <div className={styles.txBlockHeight}>
                            <div className={styles.txTitle}><BlocksIcon />&nbsp;Height</div>
                            <div className={styles.txValue}><Link to={"/blocks/" + props.txInfos['blockHeight']}>{props.txInfos['blockHeight']}</Link></div>
                        </div>
                        <div className={styles.txNbMsg}>
                            <div className={styles.txTitle}><ExchangeIcon />&nbsp;Nb&nbsp;Op.</div>
                            <div className={styles.txValue}>{props.txInfos['nbMessages']}&nbsp;operation{props.txInfos['nbMessages'] > 1 ? 's' : null}</div>
                        </div>
                        <div className={styles.txGas}>
                            <div className={styles.txTitle}><BurnIcon />&nbsp;Gas&nbsp;used/req</div>
                            <div className={styles.txValue}>{props.txInfos['gas_used']} / {props.txInfos['gas_wanted']}</div>
                        </div>
                        <div className={styles.txFees}>
                            <div className={styles.txTitle}><CoinsIcon />&nbsp;Fees</div>
                            <div className={styles.txValue}>
                                {props.txInfos['feesAmountAndCoin'].length === 0 ?
                                    "---"
                                :
                                    props.txInfos['feesAmountAndCoin'].map((element, index) => {
                                        return <div key={index}>
                                            {element.amount}
                                            <img src={'/images/coins/' + element.denom + '.png'} alt={element.denom} />
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className={styles.txTaxes}>
                            <div className={styles.txTitle}><CashIcon />&nbsp;Taxes</div>
                            <div className={styles.txValue}>
                                {props.txInfos['taxes'].length === 0 ?
                                    "---"
                                :
                                    props.txInfos['taxes'].map((element, index) => {
                                        return <div key={index}>
                                            {element.amount}
                                            <img src={'/images/coins/' + element.denom + '.png'} alt={element.denom} />
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>


                {/* <table className={styles.tblInfos}>
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
                </table> */}
            </StyledBox>
        </>
    );
};

export default BlockTxInfos;