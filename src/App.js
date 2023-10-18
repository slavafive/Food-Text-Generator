import React, { useState } from "react";
import "./App.css";

function TagList({ tags }) {
  return (
    <>
      {tags.map((tagName) => (
        <span className="tag">{tagName}</span>
      ))}
    </>
  );
}

function App() {
  const MIN_URL_NUMBER = 1;
  const MAX_URL_NUMBER = 9;

  const [restaurant, setRestaurant] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [urls, setUrls] = useState(Array(MAX_URL_NUMBER));
  const [urlNumber, setUrlNumber] = useState(MIN_URL_NUMBER);
  const [showLoader, setShowLoader] = useState(false);

  const emptyTags = [];
  for (let i = 0; i < MAX_URL_NUMBER; i++) {
    emptyTags.push([]);
  }
  const [tags, setTags] = useState(emptyTags);

  const getBackgroundSize = (value, max_value) => {
    return {
      backgroundSize: `${(value * 100) / max_value}% 100%`,
    };
  };

  const updateUrls = (newUrl, index) => {
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
      wordNumber: 200
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
      setGeneratedText(data["generated_text"]);
      const newTags = [];
      for (const [index, indexTags] of Object.entries(data["tags"])) {
        newTags.push(indexTags);
      }
      for (let i = Object.keys(data["tags"]).length; i < MAX_URL_NUMBER; i++) {
        newTags.push([]);
      }
      setTags(newTags);
    } else {
      alert(data["message"]);
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
        <br />

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

        </div>
        <br />
        <form onSubmit={onSubmit}>
          <div style={{ height: "auto" }}>
            {Array.from(Array(MAX_URL_NUMBER).keys()).map((index) => (
              <span hidden={urlNumber <= index} style={{ fontSize: 20 }}>
                {index + 1}
                <input
                  id={"input" + index}
                  name={"input" + index}
                  defaultValue=""
                  type="text"
                  index={urls[index]}
                  onChange={(e) => updateUrls(e.target.value, index)}
                  style={{ width: "400px", margin: "6px 20px" }}
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
                <div style={{ marginTop: "-8px" }}>
                  <TagList tags={tags[index]} />
                </div>
              </span>
            ))}
          </div>

          <input
            type="submit"
            value="Generate"
            className="action-button"
            style={{ marginTop: "50px" }}
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
