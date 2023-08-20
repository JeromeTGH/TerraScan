import React from 'react';
import { Link } from 'react-router-dom';

const MsgUndelegate = (props) => {
    return (
        <>
            <tr>
                <td>Amount :</td>
                <td>{props.txMessage['Amount']}</td>
            </tr>
            <tr>
                <td>From :</td>
                <td>validator <Link to={"/validators/" + props.txMessage['ValidatorAddress']}>{props.txMessage['ValidatorMoniker']}</Link></td>
            </tr>
            <tr>
                <td>To :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['DelegatorAddress']}>{props.txMessage['DelegatorAddress']}</Link></td>
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

export default MsgUndelegate;