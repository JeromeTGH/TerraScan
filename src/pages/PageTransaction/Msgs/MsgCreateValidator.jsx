import React from 'react';
import { Link } from 'react-router-dom';

const MsgCreateValidator = (props) => {
    return (
        <>
            <tr>
                <td>Commission :</td>
                <td><pre>{JSON.stringify(props.txMessage['commission'], null, 2)}</pre></td>
            </tr>
            <tr>
                <td>Delegator address :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['delegator_address']}>{props.txMessage['delegator_address']}</Link></td>
            </tr>
            <tr>
                <td>Description :</td>
                <td><pre>{JSON.stringify(props.txMessage['description'], null, 2)}</pre></td>
            </tr>
            <tr>
                <td>Min self delegation :</td>
                <td>{props.txMessage['min_self_delegation']}</td>
            </tr>
            <tr>
                <td>Val pubkey :</td>
                <td>{props.txMessage['val_pubkey']}</td>
            </tr>
            <tr>
                <td>Validator address :</td>
                <td><Link to={"/validators/" + props.txMessage['validator_address']}>{props.txMessage['validator_address']}</Link></td>
            </tr>
            <tr>
                <td>Value (bring) :</td>
                <td>{props.txMessage['value']}</td>
            </tr>
        </>
    );
};

export default MsgCreateValidator;