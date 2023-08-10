import React from 'react';
import { Link } from 'react-router-dom';

const MsgAggregateExchangeRateVote = (props) => {
    return (
        <>
            <tr>
                <td>Feeder : </td>
                <td><Link to={"/accounts/" + props.txMessage['Feeder']}>{props.txMessage['Feeder']}</Link></td>
            </tr>
            <tr>
                <td>Salt : </td>
                <td>{props.txMessage['Salt']}</td>
            </tr>
            <tr>
                <td>Validator : </td>
                <td><Link to={"/validators/" + props.txMessage['ValidatorAddress']}>{props.txMessage['ValidatorMoniker']}</Link></td>
            </tr>
            <tr>
                <td>Exchange rates : </td>
                <td>{props.txMessage['ExchangeRates'].split(' ').map((element, index) => {
                    return <span key={index}>{element}<br /></span>
                })}</td>
            </tr>
        </>
    );
};

export default MsgAggregateExchangeRateVote;