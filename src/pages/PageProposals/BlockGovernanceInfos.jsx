import React, { useEffect, useState } from 'react';
import styles from './BlockGovernanceInfos.module.scss';
import { getGovernanceInfos } from './getGovernanceInfos';
import { BlocksIcon } from '../../application/AppIcons';

const BlockGovernanceInfos = () => {

    // Variables React
    const [tableGovernanceInfos, setTableGovernanceInfos] = useState();
    const [msgErreurTableGovernanceInfos, setMsgErreurTableGovernanceInfos] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getGovernanceInfos().then((res) => {
            if(res['erreur']) {
                setMsgErreurTableGovernanceInfos(res['erreur']);
                setTableGovernanceInfos({});
            }
            else {
                setMsgErreurTableGovernanceInfos('');
                setTableGovernanceInfos(res);
            }
        })
    }, [])

    // Affichage
    return (
        <div className={"boxContainer " + styles.blockInfos}>
            <p className="h2like"><strong><BlocksIcon /><span>Rules</span></strong><span> (global)</span></p>
            {msgErreurTableGovernanceInfos ? 
                <div className="erreur">{msgErreurTableGovernanceInfos}</div>
                :
                tableGovernanceInfos && tableGovernanceInfos['nbJoursMaxDeposit'] ?
                <table className={styles.tblInfos}>
                    <tbody>
                        <tr>
                            <td><strong>Min deposit of coins</strong> (to allow vote start)&nbsp;:</td>
                            <td>{tableGovernanceInfos['nbMinDepositLunc']}</td>
                        </tr>
                        <tr>
                            <td><strong>Max deposit period</strong> (to allow vote start)&nbsp;:</td>
                            <td>{tableGovernanceInfos['nbJoursMaxDeposit']} days</td>
                        </tr>
                        <tr>
                            <td><strong>Maximum voting time</strong> (for each proposal)&nbsp;:</td>
                            <td>{tableGovernanceInfos['nbJoursMaxPourVoter']} days</td>
                        </tr>
                        <tr>
                            <td colSpan='2'>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><strong>Quorum</strong> (min % min of voters, to be valid)&nbsp;:</td>
                            <td>{tableGovernanceInfos['quorum']} %</td>
                        </tr>
                        <tr>
                            <td><strong>Acceptance threshold</strong> (min % of votes, to adopt a proposal)&nbsp;:</td>
                            <td>{tableGovernanceInfos['seuilDacceptation']} %</td>
                        </tr>
                        <tr>
                            <td><strong>Refusal threshold</strong> (min % of votes, to reject a proposal and return deposit)&nbsp;:</td>
                            <td>{tableGovernanceInfos['seuilDeRefus']} %</td>
                        </tr>
                        <tr>
                            <td><strong>Veto threshold</strong> (min % of votes, to reject a proposal and keep deposit)&nbsp;:</td>
                            <td>{tableGovernanceInfos['seuilDeVeto']} %</td>
                        </tr>
                    </tbody>
                </table>
                : <p>Loading data from blockchain (lcd) ...</p>
            }
        </div>
    );
};

export default BlockGovernanceInfos;