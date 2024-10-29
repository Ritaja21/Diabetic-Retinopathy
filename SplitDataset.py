import os
import shutil
from sklearn.model_selection import train_test_split

# Define paths
source_dir = "/media/ritika/BAB4DC86B4DC4713/ICDCIT/Dataset Preprocessed"  # The directory containing your class folders
output_dir = "Dataset_split"         # The directory where train/test/validation will be stored

# Create directories for train, test, and validation
train_dir = os.path.join(output_dir, 'train')
test_dir = os.path.join(output_dir, 'test')
val_dir = os.path.join(output_dir, 'validation')

os.makedirs(train_dir, exist_ok=True)
os.makedirs(test_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)

# Define the split ratios
test_size = 0.2  # 20% for testing
val_size = 0.1   # 10% for validation from the remaining training data

# Loop through each class directory
for class_dir in os.listdir(source_dir):
    class_path = os.path.join(source_dir, class_dir)
    
    if os.path.isdir(class_path):
        # Get list of all files in the class directory
        files = os.listdir(class_path)
        
        # Split the data into train and test
        train_files, test_files = train_test_split(files, test_size=test_size, random_state=42)
        
        # Split the train data further into train and validation
        train_files, val_files = train_test_split(train_files, test_size=val_size, random_state=42)
        
        # Create class subdirectories in train, test, and validation directories
        os.makedirs(os.path.join(train_dir, class_dir), exist_ok=True)
        os.makedirs(os.path.join(test_dir, class_dir), exist_ok=True)
        os.makedirs(os.path.join(val_dir, class_dir), exist_ok=True)
        
        # Move the files into respective directories
        for file in train_files:
            shutil.move(os.path.join(class_path, file), os.path.join(train_dir, class_dir, file))
        
        for file in test_files:
            shutil.move(os.path.join(class_path, file), os.path.join(test_dir, class_dir, file))
        
        for file in val_files:
            shutil.move(os.path.join(class_path, file), os.path.join(val_dir, class_dir, file))

print("Dataset split into train, test, and validation sets successfully.")
