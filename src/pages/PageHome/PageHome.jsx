import React, { useState } from 'react';

import styles from './PageHome.module.scss';
import SearchIcon from '@mui/icons-material/Search';

const PageHome = () => {

    const nbsp = '\u00A0';
    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState(nbsp);

    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage(nbsp);

        if(searchFieldValue === '') {
            setErrorMessage('No search value entered');
            return;    
        }


        console.log("searchFieldValue", searchFieldValue);
        setErrorMessage('No matches found, sorry');
    }

    return (
        <div className={styles.homepage}>
            <div className={styles.texts}>
                <h1>Terra Classic Finder</h1>
                <p>Enter an <span className={styles.highlighted}>Account&nbsp;address</span>, a <span className={styles.highlighted}>Block&nbsp;number</span>, or a <span className={styles.highlighted}>Transaction&nbsp;Hash</span> below</p>
            </div>
            <form className={styles.searchBar}>
                <input
                    type='search'
                    placeholder='Search for ...'
                    autoFocus
                    onChange={(e) => setSearchFieldValue(e.target.value)}
                    value={searchFieldValue}
                />
                <button onClick={(e) => {handleBtnClick(e)}}><SearchIcon /></button>
            </form>
            <div className={styles.message}>{errorMessage}</div>
        </div>
    );
};

export default PageHome;