import React from "react";
import { Link } from "react-router-dom";

function DesignSelector() {
    const designs = [
        { id: "small-cube", name: "Small Cube", description: "A simple cube." },
        { id: "small-table", name: "Small Table", description: "A customizable table." },
    ];

    return (
        <div>
            <h1>Choose Your Design</h1>
            <ul>
                {designs.map((design) => (
                    <li key={design.id}>
                        <h2>{design.name}</h2>
                        <p>{design.description}</p>
                        <Link to={`/configurator/${design.id}`}>Customize</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DesignSelector;
