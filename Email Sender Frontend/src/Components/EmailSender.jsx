import React, { useState } from "react";

export default function EmailSender() {
  const [file, setFile] = useState();
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const SubmitFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:5000/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };
  return (
    <div>
    
        <label className="label" htmlFor="fileUpload"> Upload File</label>
        <input
          type="file"
          id="fileUpload"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />

        <button>Upload</button>
        <p>Write a Message:</p>
        <input type="textarea" />

        <button onClick={SubmitFile}>SEND</button>

    </div>
  );
}
