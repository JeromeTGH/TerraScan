import React, { useEffect, useState } from 'react';
import styles from './BlockBurnTaxExemptionList.module.scss';
import { Link } from 'react-router-dom';
import { tblCorrespondanceCompte } from '../../application/AppParams';
import { loadBurnTaxExemptionList } from '../../dataloaders/loadBurnTaxExemptionList';
import StyledBox from '../../sharedComponents/StyledBox';

const BlockBurnTaxExemptionList = () => {
       
    // Variables React
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();
    const [tblTaxExemptionAddressesList, setTblTaxExemptionAddressesList] = useState([]);

    // Exécution au démarrage
    useEffect(() => {
        setIsLoading(true);

        // Récupération des infos
        loadBurnTaxExemptionList().then((res) => {
            setIsLoading(false);
            if(res['erreur']) {
                // Erreur
                setMsgErreur(res['erreur']);
                setTblTaxExemptionAddressesList([]);
            }
            else {
                // OK
                setMsgErreur('');
                setTblTaxExemptionAddressesList(res['donnees']);
                setIsLoading(false);
            }
        })
    }, [])

    // Affichage
    return (
        <StyledBox title={'Burn Tax Exemption List'} color="brown" className={styles.burnBlock}>
            {msgErreur ?
                <div className="erreur ">{msgErreur}</div>
            :
                isLoading ?
                    <div className='erreur'><br />Loading from blockchain (FCD), please wait ...</div>
                :
                    <>
                        <div className={styles.comments}>Show all registered burn tax exemption addresses</div>
                        <br />
                        <div className={styles.burnDiv}>
                            <div className={styles.addressesGrid}>
                                {tblTaxExemptionAddressesList.map((adresse, index) => {
                                    return <span key={index} className={styles.addressLabel}>
                                        <Link to={"/accounts/" + adresse}>
                                            {tblCorrespondanceCompte[adresse] ? tblCorrespondanceCompte[adresse] : adresse}
                                        </Link>
                                    </span>
                                })}
                            </div>
                        </div>
                    </>
            }
        </StyledBox>
    );
};

export default BlockBurnTaxExemptionList;