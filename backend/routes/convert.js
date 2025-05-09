const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const XLSX = require('xlsx');
const marked = require('marked');
const htmlPdf = require('html-pdf');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const cleanup = (files) => {
  files.forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
};

const errorHandler = (res, err) => {
  console.error('Conversion error:', err);
  return res.status(500).send('Conversion failed.');
};

router.post('/convert', upload.single('file'), async (req, res) => {
  const file = req.file;
  const targetFormat = req.body.format?.toLowerCase();
  const ext = path.extname(file.originalname).toLowerCase();
  const inputPath = path.resolve(file.path);

  try {
    // PDF to JPG
    if (ext === '.pdf' && targetFormat === 'jpg') {
      exec(`pdftoppm ${inputPath} ${file.path} -jpeg`, (err) => {
        if (err) return errorHandler(res, err);
        const jpgFile = `${file.path}-1.jpg`;
        return res.download(jpgFile, () => cleanup([inputPath, jpgFile]));
      });
      return;
    }

    // DOCX to PDF or TXT
    if (ext === '.docx') {
      if (targetFormat === 'pdf' || targetFormat === 'txt') {
        exec(`soffice --headless --convert-to ${targetFormat} --outdir uploads ${inputPath}`, (err) => {
          if (err) return errorHandler(res, err);
          const outputPath = inputPath.replace(/\.docx$/, `.${targetFormat}`);
          return res.download(outputPath, () => cleanup([inputPath, outputPath]));
        });
        return;
      }
    }

    // XLSX to CSV or PDF
    if (ext === '.xlsx') {
      if (targetFormat === 'csv') {
        const workbook = XLSX.readFile(inputPath);
        const outputPath = `${file.path}.csv`;
        XLSX.writeFile(workbook, outputPath, { bookType: 'csv' });
        return res.download(outputPath, () => cleanup([inputPath, outputPath]));
      }
      if (targetFormat === 'pdf') {
        exec(`soffice --headless --convert-to pdf --outdir uploads ${inputPath}`, (err) => {
          if (err) return errorHandler(res, err);
          const outputPath = inputPath.replace(/\.xlsx$/, '.pdf');
          return res.download(outputPath, () => cleanup([inputPath, outputPath]));
        });
        return;
      }
    }

    // PPTX to PDF
    if (ext === '.pptx' && targetFormat === 'pdf') {
      exec(`soffice --headless --convert-to pdf --outdir uploads ${inputPath}`, (err) => {
        if (err) return errorHandler(res, err);
        const outputPath = inputPath.replace(/\.pptx$/, '.pdf');
        return res.download(outputPath, () => cleanup([inputPath, outputPath]));
      });
      return;
    }

    // Markdown to HTML or PDF
    if (ext === '.md') {
      const mdContent = fs.readFileSync(inputPath, 'utf8');
      const htmlContent = marked(mdContent);

      if (targetFormat === 'html') {
        const outputPath = `${file.path}.html`;
        fs.writeFileSync(outputPath, htmlContent);
        return res.download(outputPath, () => cleanup([inputPath, outputPath]));
      }

      if (targetFormat === 'pdf') {
        const outputPath = `${file.path}.pdf`;
        htmlPdf.create(htmlContent).toFile(outputPath, (err) => {
          if (err) return errorHandler(res, err);
          return res.download(outputPath, () => cleanup([inputPath, outputPath]));
        });
        return;
      }
    }

    return res.status(400).send('Unsupported file format or conversion.');
  } catch (err) {
    return errorHandler(res, err);
  }
});

module.exports = router;
