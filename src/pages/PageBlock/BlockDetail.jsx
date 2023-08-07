import React, { useEffect, useState } from 'react';
import styles from './BlockDetail.module.scss';
import { getBlockDetail } from './getBlockDetail';
import { metEnFormeDateTime } from '../../application/AppUtils';
import { Link } from 'react-router-dom';

const BlockDetail = (props) => {

    // Variables React
    const [tableBlockDetail, setTableBlockDetail] = useState();
    const [msgErreurTableBlockDetail, setMsgErreurTableBlockDetail] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getBlockDetail(props.blockNumber).then((res) => {
            if(res['erreur']) {
                setMsgErreurTableBlockDetail(res['erreur']);
                setTableBlockDetail({});
            }
            else {
                setMsgErreurTableBlockDetail('');
                setTableBlockDetail(res);
            }
        })
    }, [props])
    
    return (
        <div className={"boxContainer " + styles.detailBlock}>
            {tableBlockDetail ? 
                tableBlockDetail['height'] ? 
                <table className={styles.tblInfos}>
                    <tbody>
                        <tr>
                            <td>Height :</td>
                            <td>{tableBlockDetail['height']}</td>
                        </tr>
                        <tr>
                            <td>Date/Time :</td>
                            <td>{metEnFormeDateTime(tableBlockDetail['datetime'])}</td>
                        </tr>
                        <tr>
                            <td>Number of transactions :</td>
                            <td>{tableBlockDetail['nbTransactions']}</td>
                        </tr>
                        <tr>
                            <td>Proposer (this validator) :</td>
                            <td><Link to={"/validators/" + tableBlockDetail['proposerAddress']}>{tableBlockDetail['proposerName']}</Link></td>
                        </tr>
                    </tbody>
                </table>
                : null
                : <p>Loading data from blockchain ...</p>
            }
            <div className="erreur">{msgErreurTableBlockDetail}</div>
        </div>
    );
};

export default BlockDetail;