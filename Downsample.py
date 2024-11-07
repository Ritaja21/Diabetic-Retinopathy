import os
import random
from shutil import copy2  # for copying files
from pathlib import Path

# Define paths
base_dir = "/media/mydisk/ICDCIT/Diabetic Retinopathy/Dataset_split/train"  
class_to_downsample = "2_preprocessed"
output_dir = f"{base_dir}/downsampled"  # Output directory for downsampled images

# Set the target number of images to downsample
target_class_size = 1500  

# Path for the class you want to downsample
class_path = os.path.join(base_dir, class_to_downsample)

# Check if class folder exists
if not os.path.exists(class_path):
    raise ValueError(f"The specified class '{class_to_downsample}' does not exist in {base_dir}.")

# List images in the specified class directory
images = os.listdir(class_path)

# Downsample images
downsampled_images = random.sample(images, min(len(images), target_class_size))  # Randomly select images

# Create output directory for downsampled class if it doesn't exist
downsampled_cls_path = os.path.join(output_dir, class_to_downsample)
Path(downsampled_cls_path).mkdir(parents=True, exist_ok=True)

# Copy selected images to the new directory
for img in downsampled_images:
    src_path = os.path.join(class_path, img)
    dest_path = os.path.join(downsampled_cls_path, img)
    copy2(src_path, dest_path)

print(f"Downsampled {len(downsampled_images)} images from '{class_to_downsample}' to '{downsampled_cls_path}'")
