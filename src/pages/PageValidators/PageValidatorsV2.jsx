import React, { useEffect, useState } from 'react';
import { CalculatorIcon, SearchIcon } from '../../application/AppIcons';
import styles from './PageValidators.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { isValidTerraAddressFormat, metEnFormeGrandNombre } from '../../application/AppUtils';
import { loadValidatorsList } from '../../sharedFunctions/getValidatorsV2';
import { appName } from '../../application/AppParams';
import { tblValidators } from '../../application/AppData';

const PageValidators = () => {

    const navigate = useNavigate();

    // Variables react
    const [ searchFieldValue, setSearchFieldValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ loadingOrNot, setLoadingOrNot ] = useState(true);
    const [ msgErreurGetValidators, setMsgErreurGetValidators ] = useState();

    // À exécuter au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Validators - ' + appName;

        // Récupération de tous les validateurs
        setLoadingOrNot(true);
        loadValidatorsList().then((res) => {
            if(res['erreur']) {
                setMsgErreurGetValidators(res['erreur']);
            }
            else {
                setLoadingOrNot(false);
                setMsgErreurGetValidators('');
            }
        });
    }, [])

    const handleBtnClick = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if(searchFieldValue === '') {
            setErrorMessage('→ No search value entered');
        } else if(isValidTerraAddressFormat(searchFieldValue, 'terravaloper1')) {
            navigate('/validators/' + searchFieldValue);
        } else {
            setErrorMessage('→ Validator not found, sorry');
        }
    }

    return (
        <>
            <h1><span><CalculatorIcon /><strong>Validators</strong></span></h1>
            <br />
            <h2 className={styles.h2validators}><strong><CalculatorIcon /></strong><span><strong>List of active validators</strong></span></h2>
            {msgErreurGetValidators ?
                <div className="erreur">{msgErreurGetValidators}</div>
            :
                <>
                    <table className={styles.tblValidators}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Com.</th>
                                <th>Staked</th>
                                <th>Voting power</th>
                            </tr>
                        </thead>
                        <tbody>
                        {loadingOrNot ?
                            <tr><td colSpan="5">Loading data from blockchain (fcd), please wait ...</td></tr>
                        :   
                            Object.entries(tblValidators).sort((a, b) => {return b[1].delegator_shares - a[1].delegator_shares}).map((valeur, clef) => {
                                return <tr key={clef}>
                                    <td>{clef+1}</td>
                                    <td><Link to={"/validators/" + valeur[0]}>{valeur[1].description_moniker}</Link></td>
                                    <td>{valeur[1].commission_actual_pourcentage}%</td>
                                    <td>{metEnFormeGrandNombre(valeur[1].delegator_shares/1000000, 2)}</td>
                                    <td><strong>{valeur[1].shares_on_total_shares_ratio}%</strong></td>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                    <div className={styles.comments}>
                        <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)
                    </div>
                </>
            }
            <br />
            <br />
            <h2 className={styles.h2validators}><strong><SearchIcon /></strong><span><strong>Search a specific validator</strong></span></h2>
            <p className={styles.note}>
            Enter the address of the validator you are looking for below.<br />
            <br />
            <u>Note</u> :<br />
            - a Terra Classic validor address <strong>must begin with "terravaloper1..."</strong><br />
            - this search module only searches for <strong>exact matches</strong>
            </p>
            <br />
            <div className={styles.searchBar}>
                <form>
                    <input
                        type='search'
                        placeholder='Enter a "terravaloper1..." address here'
                        onChange={(e) => setSearchFieldValue(e.target.value.trim())}    // Retrait des éventuels espaces dans la foulée (début/fin) ; très utile en cas de copier/coller
                        value={searchFieldValue}
                    />
                    <button onClick={(e) => {handleBtnClick(e)}}>
                        <SearchIcon />
                    </button>
                </form>
                <div className={"erreur " + styles.message}>{errorMessage}</div>
            </div>
        </>
    );
};

export default PageValidators;