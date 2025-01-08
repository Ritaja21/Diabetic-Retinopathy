
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PatientProfile.css';

const PatientProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const patient = location.state?.patient;

    if (!patient) {
        return <div>No patient data available.</div>;
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [preprocessedImage, setPreprocessedImage] = useState(null);



    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('patientId', patient.patientId);



        try {
            setUploading(true);


            const response = await fetch('http://localhost:8000/patient/upload', {
                method: 'POST',
                body: formData,
            });


            if (response.ok) {
                const data = await response.json();
                setImageUrl(`http://localhost:8000${data.imageUrl}`);
                console.log('Response:', data);
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleProcess = async () => {
        try {
            setProcessing(true);

            // Call the predict API with patient ID
            const response = await fetch('http://localhost:8000/patient/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patientId: patient.patientId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Prediction failed');
            }

            const data = await response.json();
            console.log('Prediction Response:', data);

            setPreprocessedImage(`data:image/jpeg;base64,${data.preprocessed_image}`);


            navigate('/report', {
                state: {
                    patient,
                    prediction: data.predicted_label,
                    confidence: data.confidence,
                    preprocessedImage: `data:image/jpeg;base64,${data.preprocessed_image}`,
                    uploadedImage: imageUrl,
                },
            });
        } catch (error) {
            console.error('Error processing prediction:', error);
            alert('Error processing prediction');
        } finally {
            setProcessing(false);
        }
    };



    return (
        <div className="patient-profile">
            <h1>Patient Details</h1>
            <form>
                <label>
                    Name:
                    <input type="text" value={patient.name} readOnly />
                </label>
                <label>
                    Age:
                    <input type="text" value={patient.age} readOnly />
                </label>
                <label>
                    Gender:
                    <input type="text" value={patient.gender} readOnly />
                </label>
                <label>
                    Patient ID:
                    <input type="text" value={patient.patientId} readOnly />
                </label>
                <label>
                    Upload image:
                    <div className="custom-file-upload">
                        <label htmlFor="file-upload" className="custom-file-label">
                            Choose File
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            className="hidden-file-input"
                        />
                    </div>

                </label>
                <button
                    className="patientprofile-button"
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <label>
                    <button
                        type="button"
                        onClick={handleProcess}
                        disabled={processing}
                        className="patientprofile-button"
                    >
                        {processing ? 'Analyzing...' : 'Analyze'}
                    </button>
                </label>
                {imageUrl && (
                    <div className="uploaded-image">
                        <h2>Uploaded Image:</h2>
                        <img src={imageUrl} alt="Uploaded" className="uploaded-img" />
                    </div>
                )}
                {preprocessedImage && (
                    <div className="preprocessed-image">
                        <h4>Preprocessed Image:</h4>
                        <img src={preprocessedImage} alt="Preprocessed" className="preprocessed-img" />
                    </div>
                )}
            </form>


        </div>
    );
};

export default PatientProfile;
