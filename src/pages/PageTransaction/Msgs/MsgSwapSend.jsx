import React from 'react';
import { Link } from 'react-router-dom';

const MsgSwapSend = (props) => {
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
                <td>From :</td>
                <td><Link to={"/accounts/" + props.txMessage['from_address']}>{props.txMessage['from_address']}</Link></td>
            </tr>
            <tr>
                <td>To :</td>
                <td><Link to={"/accounts/" + props.txMessage['to_address']}>{props.txMessage['to_address']}</Link></td>
            </tr>
        </>
    );
};

export default MsgSwapSend;