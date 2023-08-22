import React from 'react';
import { Link } from 'react-router-dom';

const MsgSwap = (props) => {
    return (
        <>
            <tr>
                <td>Ask denom :</td>
                <td>{props.txMessage['ask_denom']}</td>
            </tr>
            <tr>
                <td>Offer coin :</td>
                <td><pre>{JSON.stringify(props.txMessage['offer_coin'], null, 2)}</pre></td>
            </tr>
            <tr>
                <td>Trader :</td>
                <td><Link to={"/accounts/" + props.txMessage['trader']}>{props.txMessage['trader']}</Link></td>
            </tr>
        </>
    );
};

export default MsgSwap;