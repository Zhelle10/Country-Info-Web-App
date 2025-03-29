// CountryInformation.js

import React, { useState, useEffect } from 'react';
import './CountryInformation.css';
import CountryInfo from './CountryInfo';

function CountryInformation() {
    const [countryName, setCountryName] = useState(localStorage.getItem('countryName') || '');    //Stores the input field value(country name typed by the user). Initially set to '' (empty).Updates when the user types.
    const [countryData, setCountryData] = useState(null);  
    const [error, setError] = useState('');

     // Load stored country data when the component mounts
    useEffect(() => {
        const savedData = localStorage.getItem('countryData');
        if (savedData) {
            setCountryData(JSON.parse(savedData)); // Convert JSON string back to an object
        }
    }, []);

    const handleSearch = () => {
        if (!countryName) {
            setError('The input field cannot be empty');
            setCountryData(null);
            return;
        }

        const finalURL = `https://restcountries.com/v3.1/name/${countryName.trim()}?fullText=true`;
        fetch(finalURL)
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Not Found") {
                    setError("Country Information is not Found");
                    setCountryData(null);
                } else if (data.length === 0) {
                    setError('Please enter a valid country name.');
                    setCountryData(null);
                } else {
                    setError('');
                    setCountryData(data[0]);

                    //  Save to localStorage
                    localStorage.setItem('countryName', countryName);
                    localStorage.setItem('countryData', JSON.stringify(data[0])); // Convert object to JSON
                }
            })
            .catch(() => {
                setError('An error occurred while fetching data.');
                setCountryData(null);
            });
    };

    return (
        <div className="webApp">
            <h1>Country Information WebApp</h1>
            <div className="container">
                <div className="search">
                    <input
                        type="text"
                        id="countryName"
                        placeholder="Enter a country name here..."
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key
                    />
                    <button id="search-btn" onClick={handleSearch}>
                        Search
                    </button>
                </div>
                <div id="result">
                    {error && <h3>{error}</h3>}
                    {countryData && (<CountryInfo countryData={countryData} />)}
                </div>
            </div>
        </div>
    );
}

export default CountryInformation;
