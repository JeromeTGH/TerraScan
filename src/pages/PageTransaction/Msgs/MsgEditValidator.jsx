import React from 'react';
import { Link } from 'react-router-dom';

const MsgEditValidator = (props) => {
    return (
        <>
            <tr>
                <td>Validator :</td>
                <td>
                    <p><Link to={"/validators/" + props.txMessage['ValidatorAddress']}>{props.txMessage['ValidatorMoniker']}</Link></p>
                    <p>through his account <Link to={"/accounts/" + props.txMessage['ValidatorAddress']}>{props.txMessage['ValidatorAddress']}</Link></p>
                </td>
            </tr>
            <tr>
                <td><br />Changes ↓↓↓<br /><br /></td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td>Desc. details :</td>
                <td>{props.txMessage['descriptionDetails']}</td>
            </tr>
            <tr>
                <td>Desc. identity :</td>
                <td>{props.txMessage['descriptionIdentity']}</td>
            </tr>
            <tr>
                <td>Desc. moniker :</td>
                <td>{props.txMessage['descriptionMoniker']}</td>
            </tr>
            <tr>
                <td>Desc. security contact :</td>
                <td>{props.txMessage['descriptionSecurityContact']}</td>
            </tr>
            <tr>
                <td>Desc. website :</td>
                <td>{props.txMessage['descriptionWebsite']}</td>
            </tr>
        </>
    );
};

export default MsgEditValidator;