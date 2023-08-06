import React, { useEffect, useState } from 'react';
import { BlocksIcon, SearchIcon } from '../../application/AppIcons';
import styles from './PageBlocks.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { isValidBlockNumberFormat } from '../../application/AppUtils';
import { getLatestBlocks } from '../../sharedFunctions/getLatestBlocks';

const PageBlocks = () => {

    const navigate = useNavigate();

    // Variables react
    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ derniersBlocks, setDerniersBlocks ] = useState();           // Ici les 'n' derniers blocks [height, nbtx, proposerAddress]
    const [ msgErreurGetDerniersBlocks, setMsgErreurGetDerniersBlocks ] = useState();

    // Récupération d'infos, au chargement du component
    useEffect(() => {
        getLatestBlocks(10).then((res) => {
            if(res['erreur']) {
                setMsgErreurGetDerniersBlocks(res['erreur']);
                setDerniersBlocks([]);
            }
            else {
                setDerniersBlocks(res);
                setMsgErreurGetDerniersBlocks('');
            }
        });
    }, [])

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
                        placeholder='Search for ...'
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
            <h2 className={styles.h2blocks}><strong><BlocksIcon /></strong><span><strong>Latest blocks</strong></span></h2>
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
                                <td><Link to={'/validators/' + valeur[3]}>{valeur[4]}</Link></td>
                                <td>{valeur[5]}</td>
                            </tr> 
                    )}) : <tr><td colSpan="4">Loading data from blockchain ...</td></tr> }
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

export default PageBlocks;