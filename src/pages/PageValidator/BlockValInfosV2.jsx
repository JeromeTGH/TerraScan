import React from 'react';
import styles from './BlockValInfosV2.module.scss';
import { tblValidators } from '../../application/AppData';


const BlockValInfosV2 = (props) => {

    // Affichage
    return (
        <div className={"boxContainer " + styles.infosBlock}>
            <div className="h2like" style={{textAlign: "center"}}>{tblValidators[props.valAddress].description_moniker}</div>
            {tblValidators[props.valAddress].profile_icon ?
                <div className={styles.img}><img src={tblValidators[props.valAddress].profile_icon} alt="Validator logo" /></div>
                :
                null
            }
            <table className={styles.tblInfos}>
                <tbody>
                    <tr>
                        <td><strong>Website&nbsp;:</strong></td>
                        <td><a className={styles.website} href={tblValidators[props.valAddress].description_website} target='_blank' rel='noopener noreferrer'>{tblValidators[props.valAddress].description_website}</a></td>
                    </tr>
                    <tr>
                        <td><strong>Email&nbsp;:</strong></td>
                        <td><span  className={styles.email}>{tblValidators[props.valAddress].description_security_contact}</span></td>
                    </tr>
                    <tr>
                        <td><strong>Comments&nbsp;:</strong></td>
                        <td>{tblValidators[props.valAddress].description_details}</td>
                    </tr>
                    <tr>
                        <td><strong>Status&nbsp;:</strong></td>
                        <td>
                            <span className={tblValidators[props.valAddress].status === 'active' ? "succes" : "erreur"}><strong>{tblValidators[props.valAddress].status}</strong></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BlockValInfosV2;