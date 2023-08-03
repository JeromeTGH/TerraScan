import React, { useEffect, useState } from 'react';
import { getAccountInfos } from '../../sharedFunctions/getAccountInfos';
import { OverviewIcon } from '../../application/AppIcons';
import styles from './BlockGeneral.module.scss';
import { formateLeNombre } from '../../application/AppUtils';

const BlockGeneral = (props) => {

    // Variables React
    const [generalInfos, setGeneralInfos] = useState();
    const [msgErreurGeneralInfos, setMsgErreurGeneralInfos] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getAccountInfos(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setMsgErreurGeneralInfos(res['erreur']);
                setGeneralInfos([]);
            }
            else {
                setMsgErreurGeneralInfos('');
                setGeneralInfos(res);
            }
        })
    }, [props])

    // Affichage
    return (
        <>
            <h2><strong><OverviewIcon /></strong><span><strong>Balance of LUNC</strong></span></h2>
            <div className={styles.generalContent}>
                <table>
                    <tbody>
                        <tr>
                            <td>→&nbsp;Available =</td>
                            <td>
                                <strong>{generalInfos ? formateLeNombre(parseInt(generalInfos['availableLUNCs']), "\u00a0") : "..."}</strong>
                                <span>{generalInfos ? "," + (generalInfos['availableLUNCs']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Staked =</td>
                            <td>
                                <strong>{generalInfos ? formateLeNombre(parseInt(generalInfos['stakedLUNCs']), "\u00a0") : "..."}</strong>
                                <span>{generalInfos ? "," + (generalInfos['stakedLUNCs']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Pending rewards =</td>
                            <td>
                                <strong>{generalInfos ? formateLeNombre(parseInt(generalInfos['pendingLUNCrewards']), "\u00a0") : "..."}</strong>
                                <span>{generalInfos ? "," + (generalInfos['pendingLUNCrewards']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;Unbonding =</td>
                            <td>
                                <strong>{generalInfos ? formateLeNombre(parseInt(generalInfos['unbondingLUNC']), "\u00a0") : "..."}</strong>
                                <span>{generalInfos ? "," + (generalInfos['unbondingLUNC']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                        <tr>
                            <td colSpan="3">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>→&nbsp;<strong>Total LUNC</strong> =</td>
                            <td>
                                <strong>{generalInfos ? formateLeNombre(parseInt(generalInfos['totalLUNC']), "\u00a0") : "..."}</strong>
                                <span>{generalInfos ? "," + (generalInfos['totalLUNC']%1).toFixed(6).replace('0.', '') : "..."}</span>
                            </td>
                            <td>LUNC</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className="erreur">{msgErreurGeneralInfos}</div>
            </div>
        </>
    );
};

export default BlockGeneral;