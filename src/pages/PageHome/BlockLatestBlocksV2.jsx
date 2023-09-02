import React, { useEffect, useState } from 'react';
import styles from './BlockLatestBlocksV2.module.scss';
import { BlocksIcon } from '../../application/AppIcons';
import { Link } from 'react-router-dom';
import { tblBlocks } from '../../application/AppData';
import { metEnFormeDateTime } from '../../application/AppUtils';
import { AppContext } from '../../application/AppContext';
import { loadLatestBlocks } from '../../dataloaders/loadLatestBlocks';


const BlockLatestBlocksV2 = (props) => {

    const { liveViewState, changeLiveViewStateTo } = AppContext();

    // Variables react
    const nbBlocksAafficher = 10;
    const [ derniersBlocks, setDerniersBlocks ] = useState();           // Ici les 'n' derniers blocks [height, nbtx, proposerAddress]
    const [ msgErreurGetDerniersBlocks, setMsgErreurGetDerniersBlocks ] = useState();
    const [ refreshBlocks, setRefreshBlocks] = useState(liveViewState);
    const [ preloadingPending, setPreloadingPending] = useState(true);

    // Fonction de traitement de changement d'état de la checkbox "live view"
    const handleCheckboxChange = (e) => {
        changeLiveViewStateTo(e.target.checked);
        setRefreshBlocks(e.target.checked);
    };
    

    // Exécution au démarrage
    useEffect(() => {
        if(props.lastblockInfos) {
            // Chargement des blocks, au démarrage, que la checkbox "liveview" soit cochée ou non
            refreshBlockList(props.lastblockInfos.height);
            setTimeout(() => {
                setRefreshBlocks(true);
                setPreloadingPending(false);
            }, 6000);
        }
    }, [props.lastblockInfos])



    // Exécution toutes les X secondes, avec prise en compte ou non, selon l'état du "liveview"
    useEffect(() => {
        if(!preloadingPending && liveViewState && refreshBlocks) {
            setRefreshBlocks(false);
            refreshBlockList();
            setTimeout(() => {
                setRefreshBlocks(true);
            }, 6000);
        }
    }, [preloadingPending, liveViewState, refreshBlocks])


    // Récupération des X derniers blocks
    const refreshBlockList = (given_height) => {
        loadLatestBlocks(nbBlocksAafficher, given_height).then((res) => {
            if(res['erreur']) {
                setMsgErreurGetDerniersBlocks(res['erreur']);
                setDerniersBlocks([]);
            }
            else {
                const lastHeight = res;
                const tblData = [];
                for(let i=lastHeight ; i>(lastHeight-nbBlocksAafficher) ; i--) {
                    tblData.push([i, tblBlocks[i.toString()].nb_tx, tblBlocks[i.toString()].validator_moniker, tblBlocks[i.toString()].validator_address, tblBlocks[i.toString()].datetime ])
                }
                setDerniersBlocks(tblData);
                setMsgErreurGetDerniersBlocks('');
            }
        });
    }


    // Affichage
    return (
        <div className={"boxContainer " + styles.blocksBlock}>
            <h2 className={styles.h2blocks}>
                <span>&nbsp;</span>
                <span><strong><BlocksIcon />{nbBlocksAafficher} Latest Blocks</strong></span>
                <span className={styles.liveview}>
                    <input 
                        type="checkbox"
                        id="checkboxLiveView"
                        checked={liveViewState}
                        onChange={(e) => handleCheckboxChange(e)}
                    />
                    <label htmlFor='checkboxLiveView'>&nbsp;live&nbsp;view</label>
                </span>
            </h2>
            <table className={styles.tblListOfBlocks}>
                <thead>
                    <tr>
                        <th>Height</th>
                        <th>Nb&nbsp;Tx</th>
                        <th>Validator</th>
                        <th>Date/Time</th>
                    </tr>
                </thead>
                <tbody>
                    {derniersBlocks ? derniersBlocks.map((valeur, clef) => {
                        return (
                            <tr key={clef}>
                                <td><Link to={'/blocks/' + valeur[0]}>{valeur[0]}</Link></td>
                                <td>{valeur[1]}</td>
                                <td><Link to={'/validators/' + valeur[3]}>{valeur[2]}</Link></td>
                                <td>{metEnFormeDateTime(valeur[4])}</td>
                            </tr> 
                    )}) : <tr><td colSpan="4">Loading data from blockchain (fcd), please wait ...</td></tr> }
                </tbody>
            </table>
            <div className={styles.comments}>
                <u>Nb Tx</u> = number of transactions made in a block<br />
                <u>Validator</u> = proposer (tendermint)
            </div>
            <div className="erreur">{msgErreurGetDerniersBlocks}</div>
        </div>
    );
};

export default BlockLatestBlocksV2;