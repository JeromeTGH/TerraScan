import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlocksIcon } from '../../application/AppIcons';
import styles from './PageBlockV2.module.scss';
// import BlockDetail from './BlockDetail';
// import BlockTransactions from './BlockTransactions';
import { appName } from '../../application/AppParams';
import { getBlockInfoV2 } from './getBlockInfoV2';
import { tblBlocks } from '../../application/AppData';
import { metEnFormeDateTime } from '../../application/AppUtils';

const PageBlock = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { blockNum } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    // Variables react
    const [ loadingOrNot, setLoadingOrNot ] = useState(true);
    const [ msgErreurGetBlock, setMsgErreurGetBlock ] = useState();

    // Changement du "title" de la page web
    useEffect(() => {
        document.title = 'Block #' + blockNum + ' - ' + appName;

        // Récupération des infos concernant ce block
        setLoadingOrNot(true);
        getBlockInfoV2(blockNum).then((res) => {
            if(res['erreur']) {
                setMsgErreurGetBlock(res['erreur']);
            }
            else {
                setLoadingOrNot(false);
                setMsgErreurGetBlock('');
            }
        });

    }, [blockNum])

    return (
        <>
            <h1><span><BlocksIcon /><strong>Block</strong> #{blockNum}</span></h1>
            <br />
            
            {msgErreurGetBlock ?
                <div className="boxContainer "><div className="erreur">{msgErreurGetBlock}</div></div>
            :
            <>
                <div className="boxContainer ">
                    <table className={styles.tblInfos}>
                        <tbody>
                        {loadingOrNot ?
                            <tr><td colSpan="5">Loading data from blockchain (fcd), please wait ...</td></tr>
                        :   
                        <>
                            <tr>
                                <td>Height :</td>
                                <td>{blockNum}</td>
                            </tr>
                            <tr>
                                <td>Date/Time :</td>
                                <td>{metEnFormeDateTime(tblBlocks[blockNum].datetime)}</td>
                            </tr>
                            <tr>
                                <td>Number of transactions :</td>
                                <td>{tblBlocks[blockNum].nb_tx}</td>
                            </tr>
                            <tr>
                                <td>Proposer (this validator) :</td>
                                <td><Link to={"/validators/" + tblBlocks[blockNum].validator_address}>{tblBlocks[blockNum].validator_moniker}</Link></td>
                            </tr>
                        </>   
                        }
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="boxContainer ">
                    Txs à venir ...
                </div>
            </>
            }
        </>
    );
};

export default PageBlock;