import React, { useState } from 'react';
import { AccountIcon, SearchIcon } from '../../application/AppIcons';
import styles from './PageAccounts.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { isValidTerraAddressFormat } from '../../application/AppUtils';

const PageAccounts = () => {

    const navigate = useNavigate();

    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState("");

    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if(searchFieldValue === '') {
            setErrorMessage('→ No search value entered');
        } else if(isValidTerraAddressFormat(searchFieldValue, 'terra1')) {
            navigate('/accounts/' + searchFieldValue);
        } else {
            setErrorMessage('→ Account not found, sorry');
        }
    }

    return (
        <>
            <h1><span><AccountIcon /><strong>Accounts</strong></span></h1>
            <br />
            <h2 className={styles.h2accounts}><strong><SearchIcon /></strong><span><strong>Search a specific account</strong></span></h2>
            <p className={styles.note}>
            Enter the address of the account you are looking for below.<br />
            <br />
            <u>Note</u> :<br />
            - a Terra Classic account address <strong>must begin with "terra1..."</strong><br />
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
            <h2 className={styles.h2accounts}><strong><AccountIcon /></strong><span><strong>Notorious accounts</strong></span></h2>
            <p className={styles.notoriousAccounts}>
                → <strong>Burn</strong> address : <Link to="/accounts/terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu">terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu</Link><br />
                → <strong>Oracle Pool</strong> address : <Link to="/accounts/terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f">terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f</Link><br />  
                → <strong>Binance wallet</strong> main address : <Link to="/accounts/terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe">terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe</Link><br />
            </p>
        </>
    );
};

export default PageAccounts;