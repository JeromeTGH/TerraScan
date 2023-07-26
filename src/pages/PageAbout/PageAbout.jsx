import React from 'react';
import { Link } from 'react-router-dom';

const PageAbout = () => {
    return (
        <div>
            <h1>About</h1>
            <br />
            <p>This app, "TerraScan", is an analyzer (scan & finder) for Terra Classic blockchain.</p>
            <p>Realised by JT, @2023</p>
            <br />
            Burn address (for memory) : <Link to="/accounts/terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu">terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu</Link><br />
            <br />
            <p><u>Project sources</u> : <a href="https://github.com/JeromeTGH/Terra-Scan">https://github.com/JeromeTGH/Terra-Scan</a></p>
            <br />
            <br />
            <p>
                <mark>
                    Issues to resolve :<br />
                    - ScrollRestoration does not work as expected (when we go forward with Link, then backward ; in fact, there is an automatic scroll to top on previous page)
                </mark>
            </p>

        </div>
    );
};

export default PageAbout;