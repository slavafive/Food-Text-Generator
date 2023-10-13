import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [generatedText, setGeneratedText] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault()
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    };
    const result = await fetch("api/generate", requestOptions);
    const data = await result.json();
    setGeneratedText(data["generated_text"]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <label>
            Enter image URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
          <input type="submit" />
        </form>

        <p>Generated text: {generatedText}</p>
      </header>
    </div>
  );
}

export default App;
