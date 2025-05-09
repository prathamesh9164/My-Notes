import React, { useState } from "react";

const FileConverter = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Converting...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetFormat", format);

    try {
      const response = await fetch("http://localhost:5000/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `converted.${format}`;
      link.click();
      setMessage("Conversion successful!");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="container my-4">
      <h2>File Converter</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          className="form-control my-2"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <select name="format" id="format" class="form-select" required>
          <option value="" disabled selected>
            Select target format
          </option>

          <optgroup label="Document Formats">
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="html">HTML</option>
          </optgroup>

          <optgroup label="Spreadsheet Formats">
            <option value="csv">CSV</option>
          </optgroup>

          <optgroup label="Image Formats">
            <option value="jpg">JPG</option>
          </optgroup>
        </select>

        <button className="btn btn-primary">Convert</button>
      </form>
      <p className="my-2">{message}</p>
    </div>
  );
};

export default FileConverter;
