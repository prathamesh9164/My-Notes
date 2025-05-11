import React, { useState } from 'react';
import axios from 'axios';

function FileConverter() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('pdf');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    const res = await axios.post('http://localhost:5000/api/file/convert', formData, {
  responseType: 'blob',
});


    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `converted.${targetFormat}`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <form onSubmit={handleSubmit} className="container my-3">
      <h3>File Converter</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
      <select onChange={(e) => setTargetFormat(e.target.value)} className="form-select my-2">
        <option value="pdf">PDF</option>
        <option value="docx">DOCX</option>
        <option value="txt">TXT</option>
        <option value="png">PNG</option>
        <option value="jpg">JPG</option>
      </select>
      <button className="btn btn-primary" type="submit">Convert</button>
    </form>
  );
}

export default FileConverter;
