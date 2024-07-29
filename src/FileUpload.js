import React from 'react';

function FileUpload({ onFileUpload }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileUpload(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".stl,.obj" />
    </div>
  );
}

export default FileUpload;
