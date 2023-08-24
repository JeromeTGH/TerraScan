import React, { useEffect, useState } from 'react';
import { BlocksIcon, SearchIcon } from '../../application/AppIcons';
import styles from './PageBlocksV2.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { isValidBlockNumberFormat, metEnFormeDateTime } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import { loadLatestBlocks } from '../../sharedFunctions/getLatestBlocksV2';
import { tblBlocks } from '../../application/AppData';
import { AppContext } from '../../application/AppContext';


const PageBlocksV2 = () => {

    const navigate = useNavigate();
    const { liveViewState, changeLiveViewStateTo } = AppContext();

    // Variables react
    const nbBlocksAafficher = 10;
    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ derniersBlocks, setDerniersBlocks ] = useState();           // Ici les 'n' derniers blocks [height, nbtx, proposerAddress]
    const [ msgErreurGetDerniersBlocks, setMsgErreurGetDerniersBlocks ] = useState();
    const [ refreshBlocks, setRefreshBlocks] = useState(liveViewState);

    // Toogle pour la checkbox "live view"
    const handleCheckboxChange = (e) => {
        changeLiveViewStateTo(e.target.checked);
        setRefreshBlocks(e.target.checked);
    };

    // Exécution au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Blocks - ' + appName;

        // Chargement des blocks, au démarrage, que la checkbox "liveview" soit cochée ou non
        refreshBlockList();

    }, [])

    // Exécution toutes les X secondes, avec prise en compte ou non, selon l'état du "liveview"
    useEffect(() => {
        if(liveViewState && refreshBlocks) {
            setRefreshBlocks(false);
            setTimeout(() => {
                refreshBlockList();
                setRefreshBlocks(true);
            }, 6000);
        }
    }, [liveViewState, refreshBlocks])


    // Récupération des 10 derniers blocks
    const refreshBlockList = () => {
        loadLatestBlocks(nbBlocksAafficher).then((res) => {
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


    // Fonction de recherche par numéro de block
    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if(searchFieldValue === '') {
            setErrorMessage('→ No search value entered');
        } else if(isValidBlockNumberFormat(searchFieldValue)) {
            navigate('/blocks/' + searchFieldValue);
        } else {
            setErrorMessage('→ Block not found, sorry');
        }
    }


    // Affichage
    return (
        <>
            <h1><span><BlocksIcon /><strong>Blocks</strong></span></h1>
            <br />
            <h2 className={styles.h2blocks}><strong><SearchIcon /></strong><span><strong>Search a specific block</strong></span></h2>
            <p className={styles.note}>
            Enter the number of the block you are looking for below.<br />
            <br />
            <u>Note</u> :<br />
            - a Terra Classic block number <strong>must only include decimal digits</strong> (no letters)<br />
            - this search module only searches for <strong>exact matches</strong>
            </p>
            <br />
            <div className={styles.searchBar}>
                <form>
                    <input
                        type='search'
                        placeholder='Enter a block number here'
                        onChange={(e) => setSearchFieldValue(e.target.value.trim())}    // Retrait des éventuels espaces dans la foulée (début/fin) ; très utile en cas de copier/coller
                        value={searchFieldValue}
                    />
                    <button onClick={(e) => {handleBtnClick(e)}}>
                        <SearchIcon />
                    </button>
                </form>
                <div className={"erreur " + styles.message}>{errorMessage}</div>
            </div>
            <br />
            <br />
            <h2 className={styles.h2blocks}>
                <span><strong><BlocksIcon />{nbBlocksAafficher} Latest blocks</strong></span>
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
        </>
    );
};

export default PageBlocksV2;