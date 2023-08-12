import React, { useEffect, useState } from 'react';
import styles from './BlockValInfos.module.scss';
import { getValInfos } from './getValInfos';

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
            {tableValInfos && tableValInfos['moniker'] ? <p className={"h2like " + styles.h2Infos}>{tableValInfos['moniker']}</p> : null}
            {tableValInfos ? 
                tableValInfos['moniker'] ? 
                <table className={styles.tblInfos}>
                    <tbody>
                        <tr>
                            <td>Website :</td>
                            <td><a className={styles.website} href={tableValInfos['website']} target='_blank' rel='noopener noreferrer'>{tableValInfos['website']}</a></td>
                        </tr>
                        <tr>
                            <td>Email :</td>
                            <td><span  className={styles.email}>{tableValInfos['email']}</span></td>
                        </tr>
                        <tr>
                            <td>Comments :</td>
                            <td>{tableValInfos['details']}</td>
                        </tr>
                        <tr>
                            <td>Status :</td>
                            <td>
                                <span>{tableValInfos['activeOrNot'] ? "Bonded" : "Unbonded"}</span>
                                <span> / </span>
                                <span className={tableValInfos['jailedOrNot'] ? "erreur" : "succes"}><strong>{tableValInfos['jailedOrNot'] ? "Jailed" : "Active"}</strong></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                : null
                : <p>Loading data from blockchain (lcd) ...</p>
            }
            <div className="erreur">{msgErreurTableValInfos}</div>
        </div>
    );
};

export default BlockValInfos;