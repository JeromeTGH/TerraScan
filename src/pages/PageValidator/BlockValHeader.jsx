import React from 'react';
import styles from './BlockValHeader.module.scss';
import { tblValidators } from '../../application/AppData';


const BlockValHeader = (props) => {

    // Affichage
    return (
        <div className={"boxContainer " + styles.infosBlock}>
            <div className="h2like" style={{textAlign: "center"}}>{tblValidators[props.valAddress].description_moniker}</div>
            <div className={styles.headerBox}>
                {tblValidators[props.valAddress].profile_icon ?
                    <div className={styles.img}><img src={tblValidators[props.valAddress].profile_icon} alt="Validator logo" /></div>
                    :
                    null
                }
                <table className={styles.tblInfos}>
                    <tbody>
                        <tr>
                            <td><strong>Website&nbsp;:</strong></td>
                            <td>
                                {tblValidators[props.valAddress].description_website ?
                                    <a className={styles.website} href={tblValidators[props.valAddress].description_website} target='_blank' rel='noopener noreferrer'>{tblValidators[props.valAddress].description_website}</a>
                                :
                                    <span>(not specified)</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Email&nbsp;:</strong></td>
                            <td>
                                {tblValidators[props.valAddress].description_security_contact ?
                                <span className={styles.email}>{tblValidators[props.valAddress].description_security_contact}</span>
                            :
                                <span>(not specified)</span>
                            }
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Comments&nbsp;:</strong></td>
                            <td>
                                {tblValidators[props.valAddress].description_details ?
                                    <span>{tblValidators[props.valAddress].description_details}</span>
                                :
                                    <span>(not specified)</span>
                                }
                            </td>
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
        </div>
    );
};

export default BlockValHeader;