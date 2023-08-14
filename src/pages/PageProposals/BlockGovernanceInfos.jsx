import React, { useState } from 'react';
import styles from './BlockGovernanceInfos.module.scss';
import { BlocksIcon } from '../../application/AppIcons';

const BlockGovernanceInfos = (props) => {

    // Variables react
    const txtShow = "(click here to show rules)";
    const txtHide = "(click here to hide rules)";
    const [txtBtnShowHide, setTxtBtnShowHide] = useState(txtShow);
    const [classeShowHidePourTbl, setClasseShowHidePourTbl] = useState("tblHide");

    // Fonction toggle, sur bouton show/hide
    const handleClickOnShowHideBtn = () => {
        if(txtBtnShowHide === txtShow) {
            // Affichage du tableau
            setClasseShowHidePourTbl("tblShow");
            setTxtBtnShowHide(txtHide);
        } else {
            // Effacement du tableau
            setClasseShowHidePourTbl("tblHide");
            setTxtBtnShowHide(txtShow);
        }
    }

    // Affichage
    return (
        <div className={"boxContainer " + styles.blockInfos}>
            <div className={styles.enteteShowHide}>
                <div className={"h2like nomargin"}><strong><BlocksIcon /><span>Rules</span></strong></div>
                <div><button className="colore" onClick={() => handleClickOnShowHideBtn()}>{txtBtnShowHide}</button></div>
            </div>
            <table className={styles.tblInfos + ' ' + classeShowHidePourTbl}>
                <tbody>
                    <tr>
                        <td><strong>Min deposit of coins</strong><span className={styles.notes}>(to allow vote start)&nbsp;:</span></td>
                        <td>{props.tblGovernanceInfos['nbMinDepositLunc']}</td>
                    </tr>
                    <tr>
                        <td><strong>Max deposit period</strong><span className={styles.notes}>(to allow vote start)&nbsp;:</span></td>
                        <td>{props.tblGovernanceInfos['nbJoursMaxDeposit']} days</td>
                    </tr>
                    <tr>
                        <td><strong>Maximum voting time</strong><span className={styles.notes}>(for each proposal)&nbsp;:</span></td>
                        <td>{props.tblGovernanceInfos['nbJoursMaxPourVoter']} days</td>
                    </tr>
                    <tr>
                        <td colSpan='2'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td><strong>Quorum</strong><span className={styles.notes}>(min % min of voters, to be valid)&nbsp;:</span></td>
                        <td>{props.tblGovernanceInfos['quorum']} %</td>
                    </tr>
                    <tr>
                        <td><strong>Acceptance threshold</strong><span className={styles.notes}>(min % of votes, to adopt a proposal)&nbsp;:</span></td>
                        <td>{props.tblGovernanceInfos['seuilDacceptation']} %</td>
                    </tr>
                    <tr>
                        <td><strong>Refusal threshold</strong><span className={styles.notes}>(min % of votes, to reject a proposal and return deposit)&nbsp;:</span></td>
                        <td>{props.tblGovernanceInfos['seuilDeRefus']} %</td>
                    </tr>
                    <tr>
                        <td><strong>Veto threshold</strong><span className={styles.notes}>(min % of votes, to reject a proposal and keep deposit)&nbsp;:</span></td>
                        <td>{props.tblGovernanceInfos['seuilDeVeto']} %</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BlockGovernanceInfos;