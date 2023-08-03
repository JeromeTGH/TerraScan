import React, { useEffect, useState } from 'react';
import { getAccountInfos } from '../../sharedFunctions/getAccountInfos';
import { CoinsIcon, BlocksIcon } from '../../application/AppIcons';
import styles from './BlockBalances.module.scss';
import { formateLeNombre } from '../../application/AppUtils';

const BlockBalances = (props) => {

    // Variables React
    const [balancesInfos, setBalancesInfos] = useState();
    const [msgErreurBalancesInfos, setMsgErreurBalancesInfos] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getAccountInfos(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setMsgErreurBalancesInfos(res['erreur']);
                setBalancesInfos([]);
            }
            else {
                setMsgErreurBalancesInfos('');
                setBalancesInfos(res);
            }
        })
    }, [props])

    // Affichage
    return (
        <>
            <div className={"boxContainer " + styles.luncBalanceBlock}>
                <h2><strong><BlocksIcon /></strong><span>Balance of <strong>LUNC</strong></span></h2>
                <table className={styles.tblBalance}>
                    <tbody>
                        <tr>
                            <td>→&nbsp;Available&nbsp;=</td>
                            <td>
                                <strong>{balancesInfos ? formateLeNombre(parseInt(balancesInfos['availableLUNCs']), "\u00a0") : "..."}</strong>
                                <span>{balancesInfos ? "," + (balancesInfos['availableLUNCs']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Staked&nbsp;=</td>
                            <td>
                                <strong>{balancesInfos ? formateLeNombre(parseInt(balancesInfos['stakedLUNCs']), "\u00a0") : "..."}</strong>
                                <span>{balancesInfos ? "," + (balancesInfos['stakedLUNCs']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Rewards&nbsp;=</td>
                            <td>
                                <strong>{balancesInfos ? formateLeNombre(parseInt(balancesInfos['pendingLUNCrewards']), "\u00a0") : "..."}</strong>
                                <span>{balancesInfos ? "," + (balancesInfos['pendingLUNCrewards']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Unbonding&nbsp;=</td>
                            <td>
                                <strong>{balancesInfos ? formateLeNombre(parseInt(balancesInfos['unbondingLUNC']), "\u00a0") : "..."}</strong>
                                <span>{balancesInfos ? "," + (balancesInfos['unbondingLUNC']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                        <tr>
                            <td colSpan="3">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;<strong>Total&nbsp;LUNC&nbsp;=</strong></td>
                            <td>
                                <strong>{balancesInfos ? formateLeNombre(parseInt(balancesInfos['totalLUNC']), "\u00a0") : "..."}</strong>
                                <span>{balancesInfos ? "," + (balancesInfos['totalLUNC']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className="erreur">{msgErreurBalancesInfos}</div>
            </div>
            <div className={"boxContainer " + styles.ustcBalanceBlock}>
                <h2><strong><CoinsIcon /></strong><span>Balance of <strong>USTC</strong></span></h2>
                <table className={styles.tblBalance}>
                    <tbody>
                        <tr>
                            <td>→&nbsp;Available&nbsp;=</td>
                            <td>
                                <strong>{balancesInfos ? formateLeNombre(parseInt(balancesInfos['availableUSTCs']), "\u00a0") : "..."}</strong>
                                <span>{balancesInfos ? "," + (balancesInfos['availableUSTCs']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>USTC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Staked&nbsp;=</td>
                            <td>
                                <span>impossible</span>
                            </td>
                            <td>USTC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Rewards&nbsp;=</td>
                            <td>
                                <strong>{balancesInfos ? formateLeNombre(parseInt(balancesInfos['pendingUSTCrewards']), "\u00a0") : "..."}</strong>
                                <span>{balancesInfos ? "," + (balancesInfos['pendingUSTCrewards']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>USTC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Unbonding&nbsp;=</td>
                            <td>
                                <span>not concerned</span>
                            </td>
                            <td>USTC</td>
                        </tr>
                        <tr>
                            <td colSpan="3">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;<strong>Total&nbsp;USTC&nbsp;=</strong></td>
                            <td>
                                <strong>{balancesInfos ? formateLeNombre(parseInt(balancesInfos['totalUSTC']), "\u00a0") : "..."}</strong>
                                <span>{balancesInfos ? "," + (balancesInfos['totalUSTC']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>USTC</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className="erreur">{msgErreurBalancesInfos}</div>
            </div>
        </>
    );
};

export default BlockBalances;