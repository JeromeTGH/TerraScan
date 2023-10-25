import React, { useEffect, useState } from 'react';
import styles from './BlockTotalSupplies.module.scss';
import StyledBox from '../../sharedComponents/StyledBox';
import { getHistoricalTotalSupplies } from './getHistoricalTotalSupplies';

const BlockTotalSupplies = () => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [tblTotalSupplies, setTblTotalSupplies] = useState();
    const [msgErreur, setMsgErreur] = useState();

    // Chargement des données
    useEffect(() => {

        setIsLoading(true);
        setTblTotalSupplies([]);

        getHistoricalTotalSupplies().then((res) => {
            if(res['erreur']) {
                setTblTotalSupplies(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblTotalSupplies(res);
                setIsLoading(false);
                setMsgErreur("");
            }
        })

    }, [])

    // Et affichage
    return (
        <StyledBox title="Total Supplies" color="blue" className={styles.totalSuppliesBlock}>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>Loading "historical total supplies" from API, please wait ...</div>
                :
                    <p>Total Supplies</p>
            }
        </StyledBox>
    );
};

export default BlockTotalSupplies;