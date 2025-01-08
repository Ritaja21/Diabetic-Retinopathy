const express = require('express');
const router = express.Router();
const Patient = require('../Models/PatientSchema');
const upload = require('../Middlewares/imageMiddleware');
const path = require('path');

router.post('/add', async (req, res) => {
    const { name, age, gender, medicalHistory } = req.body;

    try {
        const latestPatient = await Patient.findOne().sort({ createdAt: -1 }).exec();
        let nextId;
        if (latestPatient && latestPatient.patientId) {
            const lastIdNum = parseInt(latestPatient.patientId.slice(1)) || 0;
            nextId = `p${lastIdNum + 1}`;
        } else {
            nextId = 'p1';
        }
        const newPatient = new Patient({
            name,
            age,
            gender,
            medicalHistory,
            patientId: nextId,
        });

        const savedPatient = await newPatient.save();
        res.status(201).json({
            message: 'Patient created successfully',
            patientId: savedPatient.patientId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
});

router.get('/search/:patientId', async (req, res) => {
    const { patientId } = req.params;
    try {
        const patient = await Patient.findOne({ patientId: patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving patient' });
    }
});

router.post('/upload', upload.single('image'), async (req, res) => {
    const { patientId } = req.body;
    try {
        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const patient = await Patient.findOne({ patientId: patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.imagePath = req.file.path;
        await patient.save();

        res.status(200).json({
            message: 'Image uploaded and saved successfully',
            file: req.file,
            imageUrl: `/uploads/${req.file.filename}`,
            updatedPatient: patient,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error uploading and saving image',
            error: err.message,
        });
    }
});

const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');


router.post('/predict', async (req, res) => {
    const { patientId } = req.body;
    try {
        const patient = await Patient.findOne({ patientId: patientId });

        if (!patient || !patient.imagePath) {
            return res.status(400).json({ message: 'Patient or image not found' });
        }

        const imagePath = path.resolve(patient.imagePath);
        if (!fs.existsSync(imagePath)) {
            return res.status(500).json({ message: 'Image file not found on server' });
        }

        // const image = await Jimp.read(imagePath);
        // image.resize(512, 512).write(imagePath); // Save resized image back to the same path

        const formData = new FormData();
        formData.append('file', fs.createReadStream(imagePath));

        const response = await axios.post('http://localhost:8001/predict/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...formData.getHeaders()
            },
        });

        const { label, confidence, preprocessed_image } = response.data;
        res.json({
            message: 'Prediction successful',
            predicted_label: response.data.label,
            confidence: response.data.confidence,
            preprocessed_image: preprocessed_image,
        });
    } catch (error) {
        console.error("Prediction error:", error.response?.data || error.message);
        res.status(500).json({
            message: 'Prediction failed',
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;