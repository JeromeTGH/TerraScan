import React from 'react';

const MsgMultiSend = (props) => {
    return (
        <>
            <tr>
                <td>Inputs :</td>
                <td><pre>{JSON.stringify(props.txMessage['inputs'], null, 2)}</pre></td>
            </tr>
            <tr>
                <td>Outputs :</td>
                <td><pre>{JSON.stringify(props.txMessage['outputs'], null, 2)}</pre></td>
            </tr>
        </>
    );
};

export default MsgMultiSend;