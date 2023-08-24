import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './PageSearch.module.scss';

import { isValidTransactionHashFormat, isValidTerraAddressFormat, isValidBlockNumberFormat } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import { SearchIcon } from '../../application/AppIcons';

const PageSearch = () => {

    const nbsp = '\u00A0';
    const navigate = useNavigate();

    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState(nbsp);

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Search - ' + appName;
    }, [])

    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage(nbsp);

        if(searchFieldValue === '') {
            setErrorMessage('No search value entered');
        } else if(isValidTransactionHashFormat(searchFieldValue)) {
            navigate('/transactions/' + searchFieldValue);
        } else if(isValidTerraAddressFormat(searchFieldValue, 'terra1')) {
            navigate('/accounts/' + searchFieldValue);
        } else if(isValidTerraAddressFormat(searchFieldValue, 'terravaloper1')) {
            navigate('/validators/' + searchFieldValue);
        } else if(isValidBlockNumberFormat(searchFieldValue)) {
            navigate('/blocks/' + searchFieldValue);
        } else {
            setErrorMessage('No matches found, sorry');
        }
    }

    return (
        <div className={styles.searchpage}>
            <div className={styles.texts}>
                <h1><strong>Search&nbsp;on Terra&nbsp;Classic</strong></h1>
                <p className='comment'>Enter an <span className={styles.highlighted}>Address</span>, a <span className={styles.highlighted}>Block&nbsp;number</span>, or a <span className={styles.highlighted}>Transaction&nbsp;hash</span> below, for&nbsp;a&nbsp;search (<u>exact&nbsp;match</u>)</p>
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
        </div>
    );
};

export default PageSearch;