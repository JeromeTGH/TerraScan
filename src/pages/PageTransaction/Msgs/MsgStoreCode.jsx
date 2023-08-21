import React from 'react';
import { Link } from 'react-router-dom';

const MsgStoreCode = (props) => {
    return (
        <>
            <tr>
                <td>Instantiate permission :</td>
                <td>{props.txMessage['instantiate_permission']}</td>
            </tr>
            <tr>
                <td>Sender :</td>
                <td><Link to={"/accounts/" + props.txMessage['sender']}>{props.txMessage['sender']}</Link></td>
            </tr>
            <tr>
                <td>Wasm byte code :</td>
                <td>{props.txMessage['wasm_byte_code']}</td>
            </tr>
        </>
    );
};

export default MsgStoreCode;