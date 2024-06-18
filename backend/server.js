const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { PDFDocument } = require("pdf-lib");

const app = express();
app.use(bodyParser.json());

// TODO: replace with environment variable
const connectString =
    "mongodb+srv://maxkuhn:UVvmWnVlImiQypBC@sicknote.mmrok17.mongodb.net/?retryWrites=true&w=majority&appName=sicknote";

mongoose.connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const doctorSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
});

const Doctor = mongoose.model("Doctor", doctorSchema);

app.post("/api/doctors", async (req, res) => {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.send(doctor);
});

// todo: delete a doctor

// todo: update a doctor

app.get("/api/doctors", async (req, res) => {
    const doctors = await Doctor.find();
    res.send(doctors);
});

app.post("/api/sicknote", async (req, res) => {
    const { userName, startDate, endDate, doctorId } = req.body;
    const doctor = await Doctor.findById(doctorId);

    const sickNote = await PDFDocument.create();
    const page = sickNote.addPage([600, 400]);

    // draw page - randomize later
    page.drawText(`Sick note for ${userName}`, { x: 50, y: 350 });
    page.drawText(`From: ${startDate}`, { x: 50, y: 330 });
    page.drawText(`To: ${endDate}`, { x: 50, y: 310 });
    page.drawText(`Signed by Dr. ${doctor.name}`);

    const pdfBytes = await sickNote.save();

    res.setHeader("Content-Disposition", "attachment; filename=sicknote.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBytes));
});

app.listen(9000, () => {
    console.log(`Server is running on port 9000`);
});
