import React, { useState, useRef } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useForm } from "react-hook-form";

function App() {
  const [generatedText, setGeneratedText] = useState("");
  const [url, setUrl] = useState("");
  const { register, handleSubmit } = useForm();

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
      body: JSON.stringify({ urls: [url, "876"] }),
    };
    const result = await fetch("api/generate", requestOptions);
    const data = await result.json();
    setGeneratedText(data["generated_text"]);
  };

  return (
    <div className="App">
      <header className="App-header">
        This app allows you to generate text for a given image that you can use
        to create an Instagram post!
        <br />
        <br />
        <Form onSubmit={onSubmit}>
          {/* <Form onSubmit={handleSubmit(onSubmit2)}> */}
          {/* <label>
            Enter image URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label> */}

          <Form.Group
            controlId="exampleForm.ControlInput1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          >
            <Form.Label>URL address</Form.Label>
            <br />
            <div>
              <Form.Control
                type="text"
                placeholder="URL"
              />
            </div>
          </Form.Group>

          <br />

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label></Form.Label>
            <Form.Control type="file" {...register("file")} />
          </Form.Group>
          <br />

          <Button type="submit">Generate</Button>
          <br />

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Generated text</Form.Label>
            <br />
            <Form.Control
              as="textarea"
              rows={3}
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
            />
          </Form.Group>

          {/* <input type="submit" /> */}
        </Form>
        {/* <p>Generated text: {generatedText}</p> */}
      </header>
    </div>
  );
}

export default App;
