import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const MIN_WORD_NUMBER = 50;
  const MAX_WORD_NUMBER = 150;
  const MIN_URL_NUMBER = 1;
  const MAX_URL_NUMBER = 9;

  const [restaurant, setRestaurant] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [urls, setUrls] = useState(Array(MAX_URL_NUMBER));
  const [urlNumber, setUrlNumber] = useState(MIN_URL_NUMBER);
  const [showLoader, setShowLoader] = useState(false);

  const [wordNumber, setWordNumber] = useState(
    (MIN_WORD_NUMBER + MAX_WORD_NUMBER) / 2
  );
  const getBackgroundSize = (value, max_value) => {
    return {
      backgroundSize: `${(value * 100) / max_value}% 100%`,
    };
  };

  const updateUrls = (newUrl, index) => {
    console.log(newUrl, index);
    for (let i = 0; i <= urls.length; i++) {
      if (i == index) {
        urls[i] = newUrl;
      }
    }
    setUrls(urls);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const params = {
      urls: urls,
      restaurant: restaurant,
      wordNumber: wordNumber,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    setShowLoader(true);
    const response = await fetch("api/generate", requestOptions);
    const data = await response.json();
    setShowLoader(false);
    if (response.ok) {
      console.log("Generated text:");
      console.log(data);
      setGeneratedText(data["generated_text"]);
    } else {
      alert(data["message"])
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        This app allows you to generate text for a given photo that you can use
        to create an Instagram post!
        <br />
        <br />
        <br />
        <label>
          Restaurant name&nbsp;&nbsp;&nbsp;
          <input
            type="text"
            style={{ width: "220px" }}
            value={restaurant}
            onChange={(event) => setRestaurant(event.target.value)}
          />
        </label>
        <div className="table">
          <div>Choose the number of photos to be processed</div>
          <div>
            <input
              type="range"
              min={MIN_URL_NUMBER}
              max={MAX_URL_NUMBER}
              onChange={(e) => setUrlNumber(e.target.value)}
              style={getBackgroundSize(urlNumber, MAX_URL_NUMBER)}
              value={urlNumber}
            />
          </div>
          <div>{urlNumber}</div>

          <div>Choose the number of words to be generated</div>
          <div>
            <input
              type="range"
              min={MIN_WORD_NUMBER}
              max={MAX_WORD_NUMBER}
              onChange={(e) => setWordNumber(e.target.value)}
              style={getBackgroundSize(
                wordNumber - MIN_WORD_NUMBER,
                MAX_WORD_NUMBER - MIN_WORD_NUMBER
              )}
              value={wordNumber}
            />
          </div>
          <div>{wordNumber}</div>
        </div>
        <br />
        <form onSubmit={onSubmit}>
          <div style={{ height: "370px" }}>
            {Array.from(Array(MAX_URL_NUMBER).keys()).map((index) => (
              <div>
                <label>
                  <span hidden={urlNumber <= index} style={{ fontSize: 20 }}>
                    {index + 1}
                    <input
                      id={"input" + index}
                      name={"input" + index}
                      defaultValue=""
                      type="text"
                      index={urls[index]}
                      onChange={(e) => updateUrls(e.target.value, index)}
                      style={{ width: "400px", margin: "5px 20px" }}
                    />
                    <button
                      type="button"
                      className="round-button"
                      onClick={(e) => {
                        document.getElementById("input" + index).value = "";
                        updateUrls("", index);
                      }}
                    >
                      x
                    </button>
                  </span>
                </label>
                <br />
              </div>
            ))}
          </div>

          <input
            type="submit"
            value="Generate"
            className="action-button"
            style={{ fontFamily: "inherit" }}
          />
          <br />
          <br />

          <div className={showLoader ? "loader" : "loader-empty"}></div>
          <br />
          <br />

          <label>
            Generated text
            <br />
            <textarea
              rows={6}
              cols={50}
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              className="form-generated-text"
              style={{ marginTop: "10px" }}
              readOnly={true}
              id="generated-text"
            ></textarea>
          </label>
          <br />
          <br />
        </form>
        <button
          type="button"
          className="action-button"
          style={{ fontFamily: "inherit", width: "80px" }}
          onClick={() => {
            document.getElementById("generated-text").select();
            document.execCommand("copy");
          }}
        >
          Copy
        </button>
      </header>
    </div>
  );
}

export default App;
