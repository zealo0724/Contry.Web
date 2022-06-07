import * as React from 'react';
import logo from '../logo.svg';

export class Loading extends React.Component {
    public render() {
        return <div>
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Loading .....
            </p>
        </div>;
    }
}