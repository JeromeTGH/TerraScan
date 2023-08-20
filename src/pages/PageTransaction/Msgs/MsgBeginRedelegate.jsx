import React from 'react';
import { Link } from 'react-router-dom';

const MsgBeginRedelegate = (props) => {
    return (
        <>
            <tr>
                <td>Amount :</td>
                <td>{props.txMessage['Amount']}</td>
            </tr>
            <tr>
                <td>Delegator :</td>
                <td><Link to={"/accounts/" + props.txMessage['DelegatorAddress']}>{props.txMessage['DelegatorAddress']}</Link></td>
            </tr>
            <tr>
                <td>Source delegator :</td>
                <td><Link to={"/validators/" + props.txMessage['SrcValidatorAddress']}>{props.txMessage['SrcValidatorMoniker']}</Link></td>
            </tr>
            <tr>
                <td>Destination delegator :</td>
                <td><Link to={"/validators/" + props.txMessage['DstValidatorAddress']}>{props.txMessage['DstValidatorMoniker']}</Link></td>
            </tr>
            <tr>
                <td>Auto withdraw rewards :</td>
                <td>{props.txMessage['withdrawRewards'].length > 0 ? props.txMessage['withdrawRewards'].map((element, index) => {
                    return <span key={index}>{element}<br /></span>
                }) : "nothing to withdraw"}</td>
            </tr>
        </>
    );
};

export default MsgBeginRedelegate;