import React from 'react';
import { Link } from 'react-router-dom';

const MsgGrantAllowance = (props) => {
    return (
        <>
            <tr>
                <td>Grantee :</td>
                <td><Link to={"/accounts/" + props.txMessage['grantee']}>{props.txMessage['grantee']}</Link></td>
            </tr>
            <tr>
                <td>Granter :</td>
                <td><Link to={"/accounts/" + props.txMessage['granter']}>{props.txMessage['granter']}</Link></td>
            </tr>
            <tr>
                <td>Allowance :</td>
                <td><pre>{JSON.stringify(props.txMessage['allowance'], null, 2)}</pre></td>
            </tr>

        </>
    );
};

export default MsgGrantAllowance;