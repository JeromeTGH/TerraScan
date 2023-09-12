import React, { useEffect, useState } from 'react';
import styles from './_Delegators.module.scss';
import StyledBox from '../../sharedComponents/StyledBox';
import { getTopDelegators } from './getTopDelegators';
import { Link } from 'react-router-dom';
import { metEnFormeAmountPartieEntiere } from '../../application/AppUtils';


const Delegators = (props) => {

    // Constantes
    const nbToShow = 50;

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblTopDelegators, setTblTopDelegators] = useState();
    const [msgErreur, setMsgErreur] = useState();
    

    // Exécution au chargement de ce component, et à chaque changement de "valAddress"
    useEffect(() => {
        setIsLoading(true);
        setTblTopDelegators([]);

        // Récupération des redelegations ce compte
        getTopDelegators(props.valAddress, nbToShow).then((res) => {
            if(res['erreur']) {
                setTblTopDelegators(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblTopDelegators(res);
                setIsLoading(false);
                setMsgErreur("");
            }
        })
    }, [props.valAddress])


    // Affichage
    return (
        <StyledBox title="Top 50 delegators" color="blue">
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>Loading "top delegators" from blockchain (lcd), please wait ...</div>
                :
                    tblTopDelegators ?
                        <div className={styles.contentTopDelegators}>
                            <table className={styles.tblTopDelegators}>
                                <thead>
                                    <tr>
                                        <th>% of this validator</th>
                                        <th>Delegator (staker)</th>
                                        <th>Staked amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tblTopDelegators.map((element, index) => {
                                        return <tr key={index}>
                                            <td>{element.percentage}&nbsp;%</td>
                                            <td><Link to={'/accounts/' + element.delegatorAddress}>{element.delegatorAddress}</Link></td>
                                            <td>
                                                <div>
                                                    <span>{metEnFormeAmountPartieEntiere(element.staked)}</span>
                                                    <img src={'/images/coins/LUNC.png'} alt='LUNC logo' />
                                                </div>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    :
                        <div>No delegator, currently.</div>
            }
        </StyledBox>
    );
};

export default Delegators;