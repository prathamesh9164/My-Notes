const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');
const libre = require('libreoffice-convert');
const util = require('util');
const convertToPDF = util.promisify(libre.convert);

exports.convertFile = async (req, res) => {
  const file = req.file;
  const targetFormat = req.body.targetFormat;

  const inputPath = path.resolve(file.path);
  const outputExt = targetFormat.toLowerCase();
  const outputPath = `${inputPath}.${outputExt}`;

  try {
    const fileBuffer = fs.readFileSync(inputPath);
    const converted = await convertToPDF(fileBuffer, `.${outputExt}`, undefined);
    fs.writeFileSync(outputPath, converted);
    res.download(outputPath, `converted.${outputExt}`, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    res.status(500).send('Conversion failed: ' + err.message);
  }
};
