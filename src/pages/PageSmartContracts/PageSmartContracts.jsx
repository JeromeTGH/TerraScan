import React, { useEffect, useState } from 'react';
import { ContractIcon, SearchIcon } from '../../application/AppIcons';
import styles from './PageSmartContracts.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { isValidContractAddressFormat } from '../../application/AppUtils';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';

const PageSmartContracts = () => {

    const navigate = useNavigate();

    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState("");

    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if(searchFieldValue === '') {
            setErrorMessage('→ No search value entered');
        } else if(isValidContractAddressFormat(searchFieldValue, 'terra1')) {
            navigate('/smartcontracts/' + searchFieldValue);
        } else {
            setErrorMessage('→ Smart Contract not found, sorry');
        }
    }

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Smart Contracts - ' + appName;
    }, [])

    return (
        <>
            <h1><span><ContractIcon /><strong>Smart Contracts</strong></span></h1>
            <StyledBox title="Search a specific Smart Contract" color="green">
                <p className={styles.note}>
                Enter the address of the contract you are looking for below.<br />
                <br />
                <u>Note</u> :<br />
                - a Terra Classic smart contract address <strong>must begin with "terra1..."</strong><br />
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
            <StyledBox title="Notorious Smart Contracts" color="orange">
                <p className={styles.notoriousSmartContracts}>
                    → <strong>Rakoff Token</strong> address : <Link to="/smartcontracts/terra1vhgq25vwuhdhn9xjll0rhl2s67jzw78a4g2t78y5kz89q9lsdskq2pxcj2">terra1vhgq25vwuhdhn9xjll0rhl2s67jzw78a4g2t78y5kz89q9lsdskq2pxcj2</Link><br />  
                    → <strong>Cookie Monster Token</strong> address : <Link to="/smartcontracts/terra15p8su45k45axng8ue59rl6zph4at27s49u3agr6uqrx3dhcxpg3qt0ekdt">terra15p8su45k45axng8ue59rl6zph4at27s49u3agr6uqrx3dhcxpg3qt0ekdt</Link><br />  
                    → <strong>Vegas Dao Coin</strong> address : <Link to="/smartcontracts/terra1cgmv3h23t9mrg7q5w5lkfcpkdrxm2csnc03afe5q6xd9x7et0desfeawx2">terra1cgmv3h23t9mrg7q5w5lkfcpkdrxm2csnc03afe5q6xd9x7et0desfeawx2</Link><br />  
               </p>
            </StyledBox>
        </>
    );
};

export default PageSmartContracts;