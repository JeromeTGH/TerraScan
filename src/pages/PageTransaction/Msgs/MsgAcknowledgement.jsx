import React from 'react';
import { Link } from 'react-router-dom';

const MsgAcknowledgement = (props) => {
    return (
        <>
            <tr>
                <td>Signer :</td>
                <td><Link to={"/accounts/" + props.txMessage['Signer']}>{props.txMessage['Signer']}</Link></td>
            </tr>
            <tr>
                <td>Packet :</td>
                <td><pre>{JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(props.txMessage['Packet']))), null, 2)}</pre></td>
                {/* JSON.stringify "tout seul" ne fonctionne pas, à l'écran */}
            </tr>
            <tr>
                <td>Proof Acked :</td>
                <td>{props.txMessage['ProofAcked']}</td>
            </tr>
            <tr>
                <td>Proof Height :</td>
                <td><pre>{JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(props.txMessage['ProofHeight']))), null, 2)}</pre></td>
                {/* JSON.stringify "tout seul" ne fonctionne pas, à l'écran */}
            </tr>
            <tr>
                <td>Acknowledgement :</td>
                <td>{props.txMessage['Acknowledgement']}</td>
            </tr>
        </>
    );
};

export default MsgAcknowledgement;