import React from 'react';
import { Link } from 'react-router-dom';

const MsgAggregateExchangeRatePrevote = (props) => {
    return (
        <>
            <tr>
                <td>Feeder : </td>
                <td><Link to={"/accounts/" + props.txMessage['Feeder']}>{props.txMessage['Feeder']}</Link></td>
            </tr>
            <tr>
                <td>Hash : </td>
                <td>{props.txMessage['Hash']}</td>
            </tr>
            <tr>
                <td>Validator : </td>
                <td><Link to={"/validators/" + props.txMessage['ValidatorAddress']}>{props.txMessage['ValidatorMoniker']}</Link></td>
            </tr>
        </>
    );
};

export default MsgAggregateExchangeRatePrevote;