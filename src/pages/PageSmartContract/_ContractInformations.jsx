import React, { useEffect, useState } from 'react';
import styles from './_ContractInformations.module.scss';
import { getContractInformations } from './getContractInformations';
import StyledBox from '../../sharedComponents/StyledBox';
import { Link } from 'react-router-dom';


const ContractInformations = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblContractInformations, setTblContractInformations] = useState();
    const [msgErreur, setMsgErreur] = useState();

    // Exécution au chargement de ce component, et à chaque changement de "contractAddress"
    useEffect(() => {

        setIsLoading(true);
        setTblContractInformations([]);

        // Récupération de la balance de ce compte
        getContractInformations(props.contractAddress).then((res) => {
            if(res['erreur']) {
                setTblContractInformations(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblContractInformations(res);
                setIsLoading(false);
                setMsgErreur("");                
            }
        })

    }, [props.contractAddress])


    // Affichage
    return (
        <>
            {msgErreur ?
                <div className="erreur"><br />{msgErreur}<br /><br /></div>
            :
                isLoading ?
                    <div className="erreur"><br />Loading "contract informations" from blockchain (lcd), please wait ...<br /><br /></div>
                :
                    tblContractInformations && tblContractInformations.code_id ?
                        <>
                            <h2 className={styles.h2Title}>{tblContractInformations.name ?
                            tblContractInformations.symbol ?
                                tblContractInformations.name + " | " + tblContractInformations.symbol
                                :
                                tblContractInformations.name
                            :
                            tblContractInformations.symbol ?
                                tblContractInformations.symbol
                                :
                                null}
                            </h2>
                            <StyledBox title="Contract informations" color="green">
                                <div className={styles.contentContractInfos}>
                                    <table className={styles.tblContractInfos}>
                                        <tbody>
                                            <tr>
                                                <td>Code ID :</td>
                                                <td>{tblContractInformations.code_id ? tblContractInformations.code_id : "(none)"}</td>
                                            </tr>
                                            <tr>
                                                <td>Creator :</td>
                                                <td>{tblContractInformations.creator ? <Link to={"/accounts/" + tblContractInformations.creator}>{tblContractInformations.creator}</Link> : "(none)"}</td>
                                            </tr>
                                            <tr>
                                                <td>Admin :</td>
                                                <td>{tblContractInformations.admin ? <Link to={"/accounts/" + tblContractInformations.admin}>{tblContractInformations.admin}</Link> : "(none)"}</td>
                                            </tr>
                                            <tr>
                                                <td>Label :</td>
                                                <td>{tblContractInformations.label}</td>
                                            </tr>
                                            <tr>
                                                <td>Block height :</td>
                                                <td>{tblContractInformations.block_height}</td>
                                            </tr>
                                            <tr>
                                                <td>Tx index :</td>
                                                <td>{tblContractInformations.tx_index}</td>
                                            </tr>
                                            <tr>
                                                <td>Ibc port id :</td>
                                                <td>{tblContractInformations.ibc_port_id ? tblContractInformations.ibc_port_id : '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </StyledBox>
                            {/* <StyledBox title="Contract history (init)" color="orange">
                                <div className={styles.formatedContractMsg}>
                                    <pre>{JSON.stringify(tblContractInformations.msg, null, 2)}</pre>
                                </div>
                            </StyledBox> */}
                            {tblContractInformations.entries.map((entry, idx) => {
                                return <StyledBox title={"Contract history (" + (idx+1) + "/" + tblContractInformations.entries.length + ")"} color="orange" key={idx}>
                                    <div className={styles.formatedContractMsg}>
                                        <pre>{JSON.stringify(entry.msg, null, 2)}</pre>
                                    </div>
                                </StyledBox>
                            })}
                        </>
                    :
                        <div>No infos, sorry.</div>
            }
        </>
    );
};

export default ContractInformations;