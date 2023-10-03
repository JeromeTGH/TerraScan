import React, { useEffect, useState } from 'react';
import { AccountIcon, SearchIcon } from '../../application/AppIcons';
import styles from './PageAccounts.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { isValidTerraAddressFormat } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';

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

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Accounts - ' + appName;
    }, [])

    return (
        <>
            <h1><span><AccountIcon /><strong>Accounts</strong></span></h1>
            <StyledBox title="Search a specific account" color="green">
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
                            placeholder='Enter a "terra1..." address here'
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
            <StyledBox title="Notorious accounts" color="orange">
                <p className={styles.notoriousAccounts}>
                    → <strong>Oracle Pool</strong> address : <Link to="/accounts/terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f">terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f</Link><br />  
                    → <strong>Community Pool</strong> address : shared account <Link to="/accounts/terra1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8pm7utl">here</Link>, but no specific address (access through API)<br />
                    → <strong>Bonded Tokens Pool</strong> address : <Link to="/accounts/terra1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3nln0mh">terra1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3nln0mh</Link><br />
                    → <strong>Unbonding Tokens Pool</strong> address : <Link to="/accounts/terra1tygms3xhhs3yv487phx3dw4a95jn7t7l8l07dr">terra1tygms3xhhs3yv487phx3dw4a95jn7t7l8l07dr</Link><br />
                    <br />
                    → <strong>Burn</strong> address : <Link to="/accounts/terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu">terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu</Link><br />
                    <br />
                    → <strong>Binance main wallet</strong> address : <Link to="/accounts/terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe">terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe</Link> (contains Binance + its customers funds)<br />
               </p>
            </StyledBox>
        </>
    );
};

export default PageAccounts;