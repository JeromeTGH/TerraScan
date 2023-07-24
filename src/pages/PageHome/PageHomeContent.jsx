import React, { useEffect, useState } from 'react';
import { formateLeNombre } from '../../application/AppUtils';
import { tblCorrespondanceValeurs } from '../../application/AppParams';

const PageHomeContent = (props) => {

    // Variables React
    const [coinsTotalSupply, setCoinsTotalSupply] = useState({});

    useEffect(() => {

        // Extraction de la total Supply de chaque coin (USTC, LUNC, ...)
        const tblTotalSupplyParCoin = []
        props.infosSupply.forEach((element) => {
            if(tblCorrespondanceValeurs[element.denom])
                tblTotalSupplyParCoin[tblCorrespondanceValeurs[element.denom]] = formateLeNombre(parseInt(element.amount/1000000), "  ");
        })
        setCoinsTotalSupply(tblTotalSupplyParCoin);
        
    }, [props.infosSupply])

    return (
        <div>
            <h1>Home</h1>
            <br />
            <p>Total LUNC supply = <strong>{coinsTotalSupply['LUNC'] ? coinsTotalSupply['LUNC'] : "..."} LUNC</strong></p>
            <p>Total USTC supply = <strong>{coinsTotalSupply['USTC'] ? coinsTotalSupply['USTC'] : "..."} USTC</strong></p>
            <br />
            {coinsTotalSupply ? Object.entries(coinsTotalSupply).map(([clef, valeur]) => {
                return <>
                    {(clef==='LUNC' || clef==='USTC') ? null :
                        <p>Total {clef} supply = <strong>{valeur} {clef}</strong></p>
                    }
                </>
            }) : null}
        </div>
    );
};

export default PageHomeContent;