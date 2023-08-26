import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlockSearch.module.scss';
import { SearchIcon } from '../../application/AppIcons';
import { isValidTransactionHashFormat, isValidTerraAddressFormat, isValidBlockNumberFormat } from '../../application/AppUtils';

const BlockSearch = () => {

    const navigate = useNavigate();

    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState("");

    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if(searchFieldValue === '') {
            setErrorMessage('→ No search value entered');
        } else if(isValidTransactionHashFormat(searchFieldValue)) {
            navigate('/transactions/' + searchFieldValue);
        } else if(isValidTerraAddressFormat(searchFieldValue, 'terra1')) {
            navigate('/accounts/' + searchFieldValue);
        } else if(isValidTerraAddressFormat(searchFieldValue, 'terravaloper1')) {
            navigate('/validators/' + searchFieldValue);
        } else if(isValidBlockNumberFormat(searchFieldValue)) {
            navigate('/blocks/' + searchFieldValue);
        } else {
            setErrorMessage('→ No matches found, sorry');
        }
    }

    return (
        <div className={"boxContainer " + styles.searchBlock}>
            <div className={styles.searchBar}>
                <form>
                    <input
                        type='search'
                        placeholder='Search for address / tx / block ...'
                        onChange={(e) => setSearchFieldValue(e.target.value.trim())}    // Retrait des éventuels espaces dans la foulée (début/fin) ; très utile en cas de copier/coller
                        value={searchFieldValue}
                    />
                    <button onClick={(e) => {handleBtnClick(e)}}>
                        <SearchIcon />
                    </button>
                </form>
                <div className={"erreur " + styles.message}>{errorMessage}</div>
            </div>
        </div>
    );
};

export default BlockSearch;