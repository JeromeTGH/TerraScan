import React, { useState } from 'react';

import styles from './PageAccueil.module.scss';
import SearchIcon from '@mui/icons-material/Search';

const PageAccueil = () => {

    const [ searchFieldValue, setSearchFieldValue ] = useState(null);

    const handleBtnClick = (e) => {
        e.preventDefault();
        console.log("searchFieldValue", searchFieldValue);
    }

    return (
        <div className={styles.homepage}>
            <form className={styles.searchBar}>
                <input type='search' placeholder='Account address / Block number / Transaction hash' autoFocus onChange={(e) => setSearchFieldValue(e.target.value)} />
                <button onClick={(e) => {handleBtnClick(e)}}><SearchIcon /></button>
            </form>
        </div>
    );
};

export default PageAccueil;