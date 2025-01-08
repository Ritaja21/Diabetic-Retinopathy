from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import tensorflow as tf
import cv2
import uvicorn
import io
import os
import time 
import base64
from fastapi.responses import HTMLResponse

app = FastAPI()

#classlabels
class_labels = {
    0:"No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR"
}

class TFRecord:

    @staticmethod
    def image_to_tfrecord(image):
        # Read the image
        if not tf.is_tensor(image):
            image = tf.convert_to_tensor(image, dtype=tf.uint8)

        # Ensure the image has 3 channels (e.g., RGB)
        # Ensure the image has 3 channels (e.g., RGB)
        if len(image.shape) == 2:  # Grayscale image
            image = tf.expand_dims(image, axis=-1)  # Add channel dimension (height, width -> height, width, 1)
            image = tf.image.grayscale_to_rgb(image)
        elif image.shape[-1] != 3:
            raise ValueError("Input image must have 3 channels (RGB).")

        # Encode the image as JPEG bytes
        image_raw = tf.io.encode_jpeg(image).numpy()

        # Serialize into TFRecord format
        feature = {
            'image_raw': tf.train.Feature(bytes_list=tf.train.BytesList(value=[image_raw])),
        }
        example = tf.train.Example(features=tf.train.Features(feature=feature))
        return example.SerializeToString()

    @staticmethod
    def parse_tfrecord(tfrecord):
        feature_description = {
            'image_raw': tf.io.FixedLenFeature([], tf.string),
        }
        parsed = tf.io.parse_single_example(tfrecord, feature_description)
        image = tf.io.decode_image(parsed['image_raw'], channels=3)
        image = tf.image.resize(image, (224, 224))  # Adjust size to model input
        image = image / 255.0  # Normalize if needed
        return tf.expand_dims(image, axis=0)  # Add batch dimension

class FundusPreprocessor:
    def __init__(self, target_diameter=900, threshold_ratio=0.05, circular_diameter=6, filter_size=3,
                 normalization_filter_size=20):
        # Initialize the two component classes
        self.roi_extractor = FundusROIextractor(target_diameter, threshold_ratio, circular_diameter)
        self.illumination_equalizer = IlluminationEqualizer(filter_size, normalization_filter_size)
        self.hist_eq = HistogramEqualizer()
        self.ad_hist = AdaptiveHistogram()

    def process(self, image):
        roi_green = self.roi_extractor.process(image)

        normalized_green = self.illumination_equalizer.normalize_image(roi_green)

        green_hist = self.hist_eq.equalize_histogram(normalized_green)

        ad_green = self.ad_hist.apply_clahe(green_hist)

        return ad_green


class FundusROIextractor:
    def __init__(self, target_diameter=900, threshold_ratio=0.05, circular_diameter=6):
        self.target_diameter = target_diameter
        self.threshold_ratio = threshold_ratio
        self.circular_diameter = circular_diameter

    # green channel extraction
    def extract_green_channel(self, image):
        return image[:, :, 1]

    def apply_global_threshold(self, image):
        max_intensity = np.max(image)
        threshold_value = int(self.threshold_ratio * max_intensity)
        _, threshold_image = cv2.threshold(image, threshold_value, 255, cv2.THRESH_BINARY)
        return threshold_image

    def morphological_operations(self, image):
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

        # Opening (Erosion followed by Dilation)
        opened_image = cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

        # Closing (Dilation followed by Erosion)
        closed_image = cv2.morphologyEx(opened_image, cv2.MORPH_CLOSE, kernel)

        return closed_image

    def resize_roi(self, image):
        # resizing using cubic interpolation
        h, w = image.shape
        current_diameter = min(h, w)
        scale_factor = self.target_diameter / current_diameter
        new_size = (int(w * scale_factor), int(h * scale_factor))
        resized_image = cv2.resize(image, new_size, interpolation=cv2.INTER_CUBIC)

        return resized_image

    def circular_corrosion(self, image):
        struct_element = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (self.circular_diameter, self.circular_diameter))
        eroded_image = cv2.erode(image, struct_element)

        return eroded_image

    def apply_mask(self, image, mask):
        mask = mask.astype(np.uint8)

        # Resize mask to match the original image size if necessary
        if mask.shape != image.shape:
            mask = cv2.resize(mask, (image.shape[1], image.shape[0]), interpolation=cv2.INTER_NEAREST)

        # Apply bitwise_and to mask the original image
        masked_image = cv2.bitwise_and(image, image, mask=mask)
        return masked_image

    def process(self, image):
        # Step 2: Extract the green channel
        green_channel = self.extract_green_channel(image)

        # Step 3: Apply global thresholding
        thresholded_image_g = self.apply_global_threshold(green_channel)

        # Step 4: Perform morphological operations (opening and closing)
        processed_image_g = self.morphological_operations(thresholded_image_g)

        # Step 5: Resize the ROI to a uniform size (e.g., 900 pixels diameter)
        resized_roi_g = self.resize_roi(processed_image_g)

        # Step 6: Apply circular corrosion to remove edge noise
        final_roi_green = self.circular_corrosion(resized_roi_g)

        masked_green = self.apply_mask(green_channel, final_roi_green)

        return masked_green


class IlluminationEqualizer:
    def __init__(self, filter_size=3, normalization_filter_size=20):
        self.filter_size = filter_size
        self.normalization_filter_size = normalization_filter_size

    def normalize_image(self, image):
        min_val = np.min(image)
        clipped_image = image - min_val
        max_val = np.max(clipped_image)
        normalized_image = cv2.normalize(clipped_image, None, 0, 255, cv2.NORM_MINMAX)

        return normalized_image


class HistogramEqualizer:
    def __init__(self):
        pass

    def equalize_histogram(self, image):
        return cv2.equalizeHist(image)


class AdaptiveHistogram:
    def __init__(self, clip_limit=2.0, tile_grid_size=(8, 8)):
        self.clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)

    def apply_clahe(self, image):
        return self.clahe.apply(image)

model_path = "C:/Users/KIIT/Documents/icdcit/model_deploy/models/best_model.keras"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

try:
    model = load_model(model_path)
    print(f"Model loaded successfully. Input shape: {model.input_shape}") 
except Exception as e:
    raise RuntimeError(f"Failed to load the model from {model_path}. Error: {str(e)}")

preprocessor = FundusPreprocessor()


def preprocess_image_with_tfrecord(file: bytes):
    try:
        # Load the image
        img = Image.open(io.BytesIO(file))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = np.array(img)

        # Apply fundus preprocessing
        preprocessed_image = preprocessor.process(img)

        # Serialize to TFRecord format
        serialized_tfrecord = TFRecord.image_to_tfrecord(preprocessed_image)

        # Parse the serialized TFRecord back to TensorFlow input
        input_image = TFRecord.parse_tfrecord(serialized_tfrecord)
        return input_image, preprocessed_image
    except Exception as e:
        raise ValueError(f"Error during image preprocessing: {str(e)}")    
    

@app.get("/")
async def read_root():
    return {"message": "Welcome to the model prediction API. Go to /docs for API documentation."}


@app.get("/favicon.ico")
async def favicon():
    return {"message": "No favicon available"}


# Define the prediction endpoint
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):

    try:
        start_time = time.time()  # Start timing

       
        contents = await file.read()
        input_image, preprocessed_image = preprocess_image_with_tfrecord(contents)

       
        preprocessing_time = time.time()
        print(f"Image preprocessing took {preprocessing_time - start_time:.2f} seconds")

      
        prediction = model.predict(input_image)

      
        prediction_time = time.time()
        print(f"Model prediction took {prediction_time - preprocessing_time:.2f} seconds")

     
       # Get the label and confidence for the most likely class
        predicted_class = np.argmax(prediction)
        confidence = float(np.max(prediction))
        label = class_labels.get(predicted_class, "Unknown")
        total_prediction_time = prediction_time - start_time

         # Resize the preprocessed image for proper rendering
        resized_preprocessed_image = cv2.resize(preprocessed_image, (224, 224))  # Adjust dimensions as needed
        _, encoded_image = cv2.imencode('.jpg', resized_preprocessed_image)
        base64_image = base64.b64encode(encoded_image).decode('utf-8')

        return JSONResponse(content={"label": label, "confidence": confidence, "prediction_time": total_prediction_time, "preprocessed_image": base64_image})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
