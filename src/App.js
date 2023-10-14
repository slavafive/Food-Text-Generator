import React, { useState, useRef } from "react";
import "./App.css";

import { useForm } from "react-hook-form";

function App() {
  const [generatedText, setGeneratedText] = useState("");
  const [urls, setUrls] = useState(Array(9))
  const [numbersOfUrls, setNumberOfUrls] = useState(1);
  const { register, handleSubmit } = useForm();

  const updateUrls = (newUrl, index) => {
    console.log(newUrl, index)
    for (let i = 0; i <= urls.length; i++) {
      if (i == index) {
        urls[i] = newUrl
      }
    }
    setUrls(urls)
    // setUrls(urls => urls.map((currentUrl, currentIndex) => currentIndex == index ? newUrl : currentUrl))
  }

  // const onSubmit2 = async (data) => {
  //   const formData = new FormData();
  //   formData.append("file", data.file);

  //   const requestOptions = {
  //     method: "POST",
  //     body: formData
  //   };
  //   const result = await fetch("api/generate", requestOptions);
  //   const response = await result.json();
  //   setGeneratedText(response["generated_text"]);
  // };

  const onSubmit = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: urls }),
    };
    const result = await fetch("api/generate", requestOptions);
    const data = await result.json();
    setGeneratedText(data["generated_text"]);
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
          Choose how many photos you would like to process:&nbsp;&nbsp;&nbsp;
          <select
            value={numbersOfUrls}
            onChange={(e) => setNumberOfUrls(e.target.value)}
            className="photo-number-selector"
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </label>
        <br />
        <br />

        <form onSubmit={onSubmit}>

          {Array.from(Array(9).keys()).map((index) => (
            <div>
              <label>
                <span hidden={numbersOfUrls <= index} style={{ fontSize: 20 }}>
                  {index + 1}
                </span>
                <input
                  name={'input' + index}
                  defaultValue=""
                  type="text"
                  index={urls[index]}
                  onChange={e => updateUrls(e.target.value, index)}
                  style={{ width: "400px", margin: "5px 20px" }}
                  hidden={numbersOfUrls <= index}
                />
              </label>
              <br />
            </div>
          ))}

          <input
            type="submit"
            value="Generate"
            style={{ fontFamily: "inherit" }}
          />
          <br />
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
            ></textarea>
          </label>
        </form>
      </header>
    </div>
  );
}

export default App;
