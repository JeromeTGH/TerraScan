import React, { useEffect, useState } from 'react';
import { formateLeNombre } from '../../application/AppUtils';

const PageHomeContent = (props) => {

    // Variables React
    const [LUNCtotalSupply, setLUNCtotalSupply] = useState('...');
    const [USTCtotalSupply, setUSTCtotalSupply] = useState('...');

    useEffect(() => {

        // Extraction de la total Supply du LUNC
        const valLUNCtotalSupply = props.infosSupply.filter(coin => coin.denom === 'uluna');
        if(valLUNCtotalSupply)
            setLUNCtotalSupply(formateLeNombre(parseInt(valLUNCtotalSupply[0].amount/1000000), "  "))

        // Extraction de la total Supply de l'USTC
        const valUSTCtotalSupply = props.infosSupply.filter(coin => coin.denom === 'uusd');
        if(valUSTCtotalSupply)
        setUSTCtotalSupply(formateLeNombre(parseInt(valUSTCtotalSupply[0].amount/1000000), "  "))
        
    }, [props.infosSupply])

    return (
        <div>
            <h1>Home</h1>
            <br />
            <p>Total LUNC supply = <strong>{LUNCtotalSupply} LUNC</strong></p>
            <p>Total USTC supply = <strong>{USTCtotalSupply} USTC</strong></p>
        </div>
    );
};

export default PageHomeContent;