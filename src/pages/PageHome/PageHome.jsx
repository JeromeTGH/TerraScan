import React, { useState } from 'react';

import styles from './PageHome.module.scss';
import SearchIcon from '@mui/icons-material/Search';

const PageHome = () => {

    const [ searchFieldValue, setSearchFieldValue ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState('');

    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage('');


        console.log("searchFieldValue", searchFieldValue);
        setErrorMessage('No matches found, sorry');
    }

    return (
        <div className={styles.homepage}>
            <h1>Terra Classic Finder</h1>
            <form className={styles.searchBar}>
                <input type='search' placeholder='Account address / Block number / Transaction hash' autoFocus onChange={(e) => setSearchFieldValue(e.target.value)} />
                <button onClick={(e) => {handleBtnClick(e)}}><SearchIcon /></button>
            </form>
            <div className={styles.message}>{errorMessage}</div>
        </div>
    );
};

export default PageHome;