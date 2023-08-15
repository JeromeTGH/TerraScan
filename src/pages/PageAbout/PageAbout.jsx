import React from 'react';
import packageJson from '../../../package.json';

const PageAbout = () => {
    return (
        <div>
            <h1>About</h1>
            <br />
            <p>This app, "TerraScan", is an scanner/finder for Terra Classic blockchain.</p>
            <br />
            <p><u>Project sources</u> : <a href="https://github.com/JeromeTGH/Terra-Scan" target="_blank" rel="noreferrer noopener">https://github.com/JeromeTGH/Terra-Scan</a></p>
            <p><u>Licence</u> : <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noreferrer noopener">Creative Commons "BY-NC-ND 4.0"</a></p>
            <br />
            <p>Version = {packageJson.version}</p>
            <br />
            <p>Created by <a href="https://twitter.com/jerometomski" target="_blank" rel="noreferrer noopener">Jerome TOMSKI</a>, @2023</p>
            <br />
        </div>
    );
};

export default PageAbout;