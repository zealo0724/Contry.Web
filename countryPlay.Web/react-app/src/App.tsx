import React from 'react';
import './App.css';
import { render } from 'react-dom';
import * as Model from './Model';
import { Loading } from './Component/Loading';
import { debug } from 'util';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Mode } from 'node:fs';

class myApp extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            CountryKeyWards: '',
            isShowActiveCountry: false
        };
    };

    componentWillMount() {
        this.GetCountryData();
    }

    GetCountryData = () => {
        //return [1, 2, 3, 4, 5];
        fetch("https://restcountries.com/v3.1/all", {
            method: "GET",
            credentials: 'same-origin',
            headers: {
                'Content-type': 'application/json',
                'Pragma': 'no-cache'
            },
            cache: "default"
        }).then(response => response.json())
            .then(data => {
                //get distinct region
                var allCountries: Model.Country[] = data;
                var region: string[] = [];
                allCountries.forEach(x => {
                    if (!region.some(y => y === x.region)) {
                        region.push(x.region);
                    }
                })

                this.setState({ countries: data, filteredCountries: data, region: region });
            });
    };

    searchCountry = (e: any) => {
        e.preventDefault();
        var countryKeyWards = this.state.CountryKeyWards || '';
        var selectedRegion: string = this.state.selectedRegion || '';
        this.filterCountryByConditions(countryKeyWards, selectedRegion);
        this.setState({ CountryKeyWards: countryKeyWards });
    }

    CountryKeyWardsOnChange = (e: any) => {
        var inputValue = e.target.value;
        this.setState({ CountryKeyWards: inputValue });
    }

    onRegionChange = (e: any) => {
        var selectedRegion = e.target.value;
        var countryKeyWards: string = this.state.CountryKeyWards || '';
        this.filterCountryByConditions(countryKeyWards, selectedRegion);
        this.setState({ selectedRegion: selectedRegion });
        
    }

    filterCountryByConditions = (countryKeyWards: string, selectedRegion: string) => {
        
        var countries: Model.Country[] = this.state.countries || [];

        var filteredCountries = countries;
        if (countryKeyWards) {
            filteredCountries = filteredCountries.filter(x => x.name.common.toLowerCase().includes(countryKeyWards.toLowerCase()));
        }
        if (selectedRegion) {
            filteredCountries = filteredCountries.filter(x => x.region === selectedRegion);
        }
        this.setState({ filteredCountries: filteredCountries });
    }

    showDetails = (country: Model.Country) => {
        this.setState({ activeCountry: country, isShowActiveCountry: true });
    }

    onHideClick = () => {
        this.setState({ activeCountry: null, isShowActiveCountry: false });
    }

    render() {
        var region: string[] = this.state.region;
        var activeCountry: Model.Country = this.state.activeCountry;
        return (
            <div className="countryBody">
                <div style={{ width: '80%', padding:"100px 0" }}>
                    <input name="CountryKeyWards" value={this.state.CountryKeyWards} onChange={this.CountryKeyWardsOnChange.bind(this)}
                        type="text" style={{ "width": "500px" }} required />
                    <button name="SearchButton" type="button" onClick={this.searchCountry.bind(this)} >Search Country</button>
                    {this.state.filteredCountries
                        ?
                        <table style={{ "fontSize": '18px', "marginTop": "50px" }}>
                            <thead>
                                <tr>
                                <td style={{ "width": "500px" }}>Country Region
                                    {region && <select style={{ marginLeft: "5px" }} onChange={this.onRegionChange.bind(this)}>
                                        <option value=''></option>
                                        {region.map(x => <option key={x} value={x}>{x}</option>)}
                                    </select>}
                                </td>
                                    <td style={{ "width": "600px" }}>Country Name</td>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.filteredCountries && this.state.filteredCountries.map((x: Model.Country) =>
                                <tr key={x.name.common}>
                                    <td>{x.region}</td>
                                    <a onClick={ () => this.showDetails(x) }>{x.name.common}</a>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                        :
                        <Loading />
                    }
                </div>

                {this.state.isShowActiveCountry && <Modal
                    show={this.state.isShowActiveCountry}
                    onHide={() => this.onHideClick()}
                    backdrop="static"
                    keyboard={true}
                    size="lg"
                    className={"bootStrapCustomer"}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <div><label className="title">Country Name</label></div>
                            <div><label>{activeCountry.name.common}</label></div>
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <div><label>Country Region</label></div>
                            <div><label>{activeCountry.region}</label></div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.onHideClick()}>Close</Button>
                    </Modal.Footer>
                </Modal>}
            </div>
        );
    }
}

export default myApp;
