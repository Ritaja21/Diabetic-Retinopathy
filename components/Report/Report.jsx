import React from 'react';
import { useLocation } from 'react-router-dom'; // Access state passed during navigation
import './Report.css'; // CSS for styling // Import jsPDF for generating PDFs
import jsPDF from 'jspdf';


const Report = () => {
    const location = useLocation();
    console.log('Location state:', location.state);
    const { patient, prediction, confidence, preprocessedImage, uploadedImage } = location.state || {};


    if (!patient || !prediction || confidence === undefined || !uploadedImage) {
        return <div>No report data available.</div>;
    }



    const predictionLabel = {
        "No DR": "No Diabetic Retinopathy",
        "Mild": "Mild Diabetic Retinopathy",
        "Moderate": "Moderate Diabetic Retinopathy",
        "Severe": "Severe Diabetic Retinopathy",
        "Proliferative DR": "Proliferative Diabetic Retinopathy"
    };

    const predictedLabel = predictionLabel[prediction] || 'Unknown';

    const aftercareAdvice = {
        "No DR": "No immediate aftercare is needed. However, regular checkups are advised to monitor eye health.",
        "Mild": "For Mild Diabetic Retinopathy, maintain good blood sugar control, and get regular eye exams to monitor the condition.",
        "Moderate": "For Moderate Diabetic Retinopathy, maintain strict control of blood sugar, cholesterol, and blood pressure. Follow-up exams every 6 months are essential.",
        "Severe": "Severe Diabetic Retinopathy requires immediate attention. Tight blood sugar control is necessary, and you should follow up regularly with an eye specialist.",
        "Proliferative DR": "Proliferative Diabetic Retinopathy requires urgent medical attention. Laser treatment or other procedures may be needed. Strict control of blood sugar, cholesterol, and blood pressure is crucial."
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Patient Report", 10, 10);

        doc.setFontSize(12);
        doc.text(`Name: ${patient.name}`, 10, 20);
        doc.text(`Age: ${patient.age}`, 10, 30);
        doc.text(`Gender: ${patient.gender}`, 10, 40);
        doc.text(`Patient ID: ${patient.patientId}`, 10, 50);
        doc.text(`Impression: ${predictedLabel}`, 10, 60);
        // Check if medical history is available
        if (patient.medicalHistory) {
            doc.text(`Symptoms: ${patient.medicalHistory}`, 10, 70);
        }

        // Add aftercare advice with word wrapping
        const aftercareText = aftercareAdvice[prediction];
        doc.text('Aftercare Advice:', 10, 80);

        // Create word-wrapped text for aftercare advice
        const lineHeight = 6; // Adjust line height to prevent text from overlapping
        const pageWidth = doc.internal.pageSize.width - 20; // Width of the page minus margins
        let yPos = 90; // Start position for the aftercare advice

        // Split the text into lines and add each line to the PDF
        const lines = doc.splitTextToSize(aftercareText, pageWidth); // Automatically wraps text based on width
        lines.forEach((line, index) => {
            doc.text(line, 10, yPos);
            yPos += lineHeight; // Move to the next line
        });
        yPos += 10;

        // Add uploaded image if available

        if (uploadedImage) {
            doc.text('Uploaded Image:', 10, yPos);
            yPos += 10;
            doc.addImage(uploadedImage, 'JPEG', 10, yPos, 90, 60); // Adjust size and position
            yPos += 70;
        }

        if (preprocessedImage) {
            doc.text('Preprocessed Image:', 10, yPos);
            yPos += 10;
            doc.addImage(preprocessedImage, 'JPEG', 10, yPos, 90, 60); // Adjust size and position
        }

        doc.save(`${patient.name}_Report.pdf`);
    };

    return (
        <div className="report">
            <h2>Patient Report</h2>
            <div className="report-card">
                <h3>Patient Details</h3>
                <p><strong>Name: </strong> {patient.name}</p>
                <p><strong>Age: </strong> {patient.age}</p>
                <p><strong>Gender: </strong> {patient.gender}</p>
                <p><strong>Patient ID: </strong> {patient.patientId}</p>
                <div className="uploaded-image">
                    <h3>Uploaded Image:</h3>
                    <img src={uploadedImage} alt="Uploaded" className="image" />
                </div>
            </div>
            <div className="prediction-card">
                <h3>Prediction Result</h3>
                <p><strong>Symptoms: </strong>{patient.medicalHistory}</p>
                <div className="aftercare-advice">
                    <p><strong>Aftercare Advice:</strong></p>
                    <p>{aftercareAdvice[prediction]}</p>
                </div>
                <div className="preprocessed-image">
                    <h3>Preprocessed Image:</h3>
                    <img src={preprocessedImage} alt="Preprocessed" className="image" />
                    <p><strong>Impression:</strong> {predictedLabel}</p>
                </div>
            </div>
            <button className="download-button" onClick={handleDownload}>Download</button>
        </div>
    );
};

export default Report;
