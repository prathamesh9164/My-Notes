const express = require("express");
const multer = require("multer");
const path = require("path");
const mammoth = require("mammoth");
const { PDFDocument } = require("pdf-lib");
const tesseract = require("tesseract.js");

const app = express();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route for file upload and conversion
app.post("/convert", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { file } = req;
  const { outputFormat } = req.body;

  // Handle Word to PDF conversion
  if (outputFormat === "pdf" && path.extname(file.originalname) === ".docx") {
    try {
      // Read .docx file and convert it to HTML
      const htmlContent = await mammoth.convertToHtml({ path: file.path });

      // Create a PDF document from the HTML (basic example)
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      page.drawText(htmlContent.value, {
        x: 50,
        y: height - 50,
        size: 12,
      });

      // Save the PDF and send the download link
      const pdfBytes = await pdfDoc.save();
      const pdfPath = `uploads/${file.filename}.pdf`;
      require("fs").writeFileSync(pdfPath, pdfBytes);

      return res.send({
        message: `File "${file.originalname}" converted to PDF successfully.`,
        convertedFile: `/uploads/${file.filename}.pdf`, // Path to the converted PDF
      });
    } catch (error) {
      return res.status(500).send("Error converting Word to PDF.");
    }
  }

  res.status(400).send("Conversion format not supported.");
});

// Route for image OCR
app.post("/ocr", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { file } = req;

  // Perform OCR on the uploaded image
  tesseract.recognize(
    file.path,
    "eng", // Language to recognize (you can add more languages)
    {
      logger: (m) => console.log(m), // Optional: logs the OCR process
    }
  )
    .then(({ data: { text } }) => {
      res.send({
        message: "OCR processing complete",
        text, // Return the extracted text
      });
    })
    .catch((error) => {
      res.status(500).send("Error during OCR processing.");
    });
});

// Static folder to serve the uploaded files
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
