import React, { useState } from "react";
import Viewer from "./Viewer";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={`${process.env.PUBLIC_URL}/logo.jpeg`} className="App-logo" alt="logo" />
        <h1>Instant Quote iMake</h1>
      </header>
      <main>
        <input type="file" multiple onChange={handleFileChange} />
        <div className="files-list">
          {files.map((file, index) => (
            <Viewer key={index} file={file} onRemove={handleRemoveFile} />
          ))}
        </div>
      </main>
      <footer className="App-footer">
        <p>© 2024 iMake. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
