import React, { useEffect, useState } from 'react';
import { ExchangeIcon, SearchIcon } from '../../application/AppIcons';
import styles from './PageTransactions.module.scss';
import { useNavigate } from 'react-router-dom';
import { isValidTransactionHashFormat } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';
// import { getLatestBlocks } from '../../sharedFunctions/getLatestBlocks';

const PageTransactions = () => {

    const navigate = useNavigate();

    // Variables react
    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState("");

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Transactions - ' + appName;
    }, [])

    // Routine de recherche
    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if(searchFieldValue === '') {
            setErrorMessage('→ No search value entered');
        } else if(isValidTransactionHashFormat(searchFieldValue)) {
            navigate('/transactions/' + searchFieldValue);
        } else {
            setErrorMessage('→ Block not found, sorry');
        }
    }

    // Affichage
    return (
        <>
            <h1><span><ExchangeIcon /><strong>Transactions</strong></span></h1>
            <StyledBox title="Search a specific transaction" color="green">
                <p className={styles.note}>
                Enter the hash of the transaction you are looking for below.<br />
                <br />
                <u>Note</u> :<br />
                - a Terra Classic transaction hash (Tx Hash) <strong>consists of a string of 64 hexadecimal characters</strong><br />
                - this search module only searches for <strong>exact matches</strong>
                </p>
                <br />
                <div className={styles.searchBar}>
                    <form>
                        <input
                            type='search'
                            placeholder='Enter a "Transaction Hash" here'
                            onChange={(e) => setSearchFieldValue(e.target.value.trim())}    // Retrait des éventuels espaces dans la foulée (début/fin) ; très utile en cas de copier/coller
                            value={searchFieldValue}
                        />
                        <button onClick={(e) => {handleBtnClick(e)}}>
                            <SearchIcon />
                        </button>
                    </form>
                    <div className={"erreur " + styles.message}>{errorMessage}</div>
                </div>
            </StyledBox>
        </>
    );
};

export default PageTransactions;