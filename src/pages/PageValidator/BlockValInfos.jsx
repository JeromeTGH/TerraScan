import React, { useEffect, useState } from 'react';
import styles from './BlockValInfos.module.scss';
import { getValInfos } from './getValInfos';
// import { HomeIcon } from '../../application/AppIcons';

const BlockValInfos = (props) => {
    
    // Variables React
    const [tableValInfos, setTableValInfos] = useState();
    const [msgErreurTableValInfos, setMsgErreurTableValInfos] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getValInfos(props.valAddress).then((res) => {
            if(res['erreur']) {
                setMsgErreurTableValInfos(res['erreur']);
                setTableValInfos({});
            }
            else {
                setMsgErreurTableValInfos('');
                setTableValInfos(res);
            }
        })
    }, [props])

    // Affichage
    return (
        <div className={"boxContainer " + styles.infosBlock}>
            {tableValInfos && tableValInfos['moniker'] ? <h2 className={styles.h2Infos}>{tableValInfos['moniker']}</h2> : null}
            {tableValInfos ? 
                tableValInfos['moniker'] ? 
                <table className={styles.tblInfos}>
                    <tbody>
                        <tr>
                            <td>Website :</td>
                            <td><a href={tableValInfos['website']} target='_blank' rel='noopener noreferrer'>{tableValInfos['website']}</a></td>
                        </tr>
                        <tr>
                            <td>Email :</td>
                            <td>{tableValInfos['email']}</td>
                        </tr>
                        <tr>
                            <td>Détail :</td>
                            <td>{tableValInfos['details']}</td>
                        </tr>
                        <tr>
                            <td>Status :</td>
                            <td>{tableValInfos['activeOrNot'] ? "Bonded" : "Unbonded"} / {tableValInfos['jailedOrNot'] ? "Jailed" : "Active"}</td>
                        </tr>
                    </tbody>
                </table>
                : null
                : <p>Loading data from blockchain ...</p>
            }
            <div className="erreur">{msgErreurTableValInfos}</div>
        </div>
    );
};

export default BlockValInfos;