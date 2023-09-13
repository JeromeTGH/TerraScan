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
                            <div className={styles.txTitle}><ExchangeIcon />&nbsp;Nb&nbsp;Msg</div>
                            <div className={styles.txValue}>{props.txInfos['nbMessages']}&nbsp;message{props.txInfos['nbMessages'] > 1 ? 's' : null}</div>
                        </div>
                        <div className={styles.txGas}>
                            <div className={styles.txTitle}><BurnIcon />&nbsp;Gas&nbsp;used/req.</div>
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
                                            {element.denom.includes('ibc') ? <span className={styles.ibc}>{element.denom}</span> : <img src={'/images/coins/' + element.denom + '.png'} alt={element.denom} />}
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
                                            {element.denom.includes('ibc') ? <span className={styles.ibc}>{element.denom}</span> : <img src={'/images/coins/' + element.denom + '.png'} alt={element.denom} />}
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </StyledBox>
        </>
    );
};

export default BlockTxInfos;