import cv2
import argparse
import os
import numpy as np
from tqdm import tqdm  # Import tqdm for progress bar


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


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--image", required=True, help="Path to the image folder")
    args = ap.parse_args()

    folder_name = os.path.basename(args.image)

    # Create the new folder for preprocessed images (e.g., "0_preprocessed")
    new_folder_name = os.path.join(os.path.dirname(args.image), folder_name + "_preprocessed")
    os.makedirs(new_folder_name, exist_ok=True)

    # Use tqdm to display progress
    file_list = os.listdir(args.image)
    for file_name in tqdm(file_list, desc="Processing images"):
        file_path = os.path.join(args.image, file_name)

        # Check if it's a file (ignore directories)
        if os.path.isfile(file_path):
            # Read the image using OpenCV
            image = cv2.imread(file_path)

            preprocessor = FundusPreprocessor()
            green = preprocessor.process(image)

            new_file_path = os.path.join(new_folder_name, file_name)

            # Save the preprocessed image to the new directory
            cv2.imwrite(new_file_path, green)
