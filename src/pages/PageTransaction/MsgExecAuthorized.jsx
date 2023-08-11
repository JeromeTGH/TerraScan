import React from 'react';
import { Link } from 'react-router-dom';

const MsgExecAuthorized = (props) => {
    return (
        <>
            <tr>
                <td>Grantee :</td>
                <td><Link to={"/accounts/" + props.txMessage['Grantee']}>{props.txMessage['Grantee']}</Link></td>
            </tr>
            {props.txMessage['Msgs'].map((element, index) => {
                return <tr key={index}>
                    <td>Msg #{index}</td>
                    <td><pre>{JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(element))), null, 2)}</pre></td>
                    {/* JSON.stringify "tout seul" ne fonctionne pas, à l'écran */}
                </tr>
            })}
        </>
    );
};

export default MsgExecAuthorized;