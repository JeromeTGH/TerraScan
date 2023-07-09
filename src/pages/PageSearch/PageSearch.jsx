import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './PageSearch.module.scss';

import { isValidTransactionHashFormat, isValidTerraAddressFormat, isValidBlockNumberFormat } from '../../application/AppUtils';
import { chainID, chainName } from '../../application/AppParams';
import { SearchIcon } from '../../application/AppIcons';

const PageSearch = () => {

    const nbsp = '\u00A0';
    const navigate = useNavigate();

    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState(nbsp);

    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage(nbsp);

        if(searchFieldValue === '') {
            setErrorMessage('No search value entered');
        } else if(isValidTransactionHashFormat(searchFieldValue)) {
            navigate('/transaction/' + searchFieldValue);
        } else if(isValidTerraAddressFormat(searchFieldValue, 'terra1')) {
            navigate('/account/' + searchFieldValue);
        } else if(isValidTerraAddressFormat(searchFieldValue, 'terravaloper1')) {
            navigate('/validator/' + searchFieldValue);
        } else if(isValidBlockNumberFormat(searchFieldValue)) {
            navigate('/block/' + searchFieldValue);
        } else {
            setErrorMessage('No matches found, sorry');
        }
    }

    return (
        <div className={styles.searchpage}>
            <div className={styles.texts}>
                <h1>Terra Classic Finder</h1>
                <p className='comment'>Enter an <span className={styles.highlighted}>Account&nbsp;address</span>, a <span className={styles.highlighted}>Block&nbsp;number</span>, or a <span className={styles.highlighted}>Transaction&nbsp;hash</span> below, for&nbsp;a&nbsp;search (exact&nbsp;match)</p>
            </div>
            <div className={styles.searchBar}>
                <form>
                    <input
                        type='search'
                        placeholder='Search for ...'
                        className={styles.pgsearch}
                        autoFocus
                        onChange={(e) => setSearchFieldValue(e.target.value.trim())}    // Retrait des éventuels espaces dans la foulée (début/fin) ; très utile en cas de copier/coller
                        value={searchFieldValue}
                    />
                    <button className={styles.pgsearch} onClick={(e) => {handleBtnClick(e)}}><SearchIcon /></button>
                </form>
                <p className={"erreur " + styles.message}>{errorMessage}</p>
            </div>
            <div className={'comment ' + styles.cmtbtm}>Using {chainName} LCD ({chainID})</div>
        </div>
    );
};

export default PageSearch;