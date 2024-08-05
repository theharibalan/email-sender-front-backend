import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Label = styled.label`
  font-weight: bold;
  min-width: 120px;
  margin-right: 10px;
  text-align: right;
  @media (max-width: 768px) {
    margin-bottom: 5px;
    text-align: left;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
  &:focus {
    border-color: #4caf50;
  }
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const Textarea = styled.textarea`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  height: 150px; /* Increased height */
  &:focus {
    border-color: #4caf50;
  }
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #45a049;
  }
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export default function App() {
  const [file, setFile] = useState();
  const [pdf, setPdf] = useState();
  const [sub, setSub] = useState();
  const [content, setContent] = useState();

  const handleSubChange = (e) => {
    setSub(e.target.value);
  };

  const handleSetContent = (e) => {
    setContent(e.target.value);
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePdfFileUpload = (event) => {
    setPdf(event.target.files[0]);
  };

  const sendMail = async () => {
    const data = { sub: sub, content: content };
    const url = "http://localhost:5000/send";

    axios
      .post(url, data)
      .then((res) => {
        toast.success("Mail sent successfully!");
        console.log(res);
      })
      .catch((res) => {
        toast.error("Failed to send mail.");
        console.log(res);
      });
  };

  const submitPdf = async () => {
    const formData = new FormData();
    formData.append("file", pdf);

    try {
      const response = await axios.post("http://localhost:5000/pdfup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("PDF uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload PDF.");
    }
  };

  const SubmitFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload file.");
    }
  };

  return (
    <Container>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      
      <Field>
        <Label htmlFor="fileUpload">Upload File</Label>
        <Input type="file" id="fileUpload" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <Button onClick={SubmitFile}>Upload</Button>
      </Field>
      
      <Field>
        <Label htmlFor="sub">Subject:</Label>
        <Input type="text" id="sub" onChange={handleSubChange} />
      </Field>
      
      <Field>
        <Label htmlFor="message">Write a Message:</Label>
        <Textarea id="message" name="message" onChange={handleSetContent}></Textarea>
      </Field>
      
      <Field>
        <Label htmlFor="fileUpload">Upload Attachment</Label>
        <Input type="file" id="fileUpload" accept="pdf, jpg, png, jpeg" onChange={handlePdfFileUpload} />
        <Button onClick={submitPdf}>Upload</Button>
      </Field>
      
      <Button onClick={sendMail} style={{ width: "100%" }}>SEND</Button>
    </Container>
  );
}
