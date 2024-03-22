var express = require("express");
var router = express.Router();
const qr = require("qrcode");
const { codeGenerator, getHtmlTemplate } = require("../utils/utils");
const html_to_pdf = require("html-pdf-node");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/code", async (req, res) => {
  try {
    const code = codeGenerator();
    const url = `http://localhost:5000/api/v1/code/${code}?amount=1&service=software%20service`;
    // Generate QR code data URL
    const qrCodeDataUrl = await qr.toDataURL(url);

    // Render the Pug template and pass the QR code data URL
    res.render("code", { qrCodeDataUrl });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/api/v1/code/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const { amount, service } = req.query;
    const html_template = getHtmlTemplate(code, service, amount);

    const pdfBuffer = await html_to_pdf.generatePdf(
      { content: html_template },
      { format: "A4" }
    );

    res.set("Content-Disposition", 'attachment; filename="invoice.pdf"');
    res.set("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(400).send(error?.message);
  }
});

module.exports = router;
