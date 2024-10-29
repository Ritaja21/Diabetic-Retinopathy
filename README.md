# Diabetic Retinopathy Detection

This project aims to detect Diabetic Retinopathy (DR) from retinal fundus images using deep learning techniques. It employs convolutional neural networks (CNNs) to classify images into different stages of DR, contributing to early diagnosis and treatment planning.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Model Training](#model-training)
- [Evaluation](#evaluation)
- [Contributing](#contributing)

## Introduction

Diabetic Retinopathy is a severe complication of diabetes that can lead to vision loss. Early detection through image analysis can significantly improve patient outcomes. This project leverages deep learning techniques to automate the classification of DR stages in fundus images.

## Work in Progress

Please note that this project is currently under development. Features and functionalities are still being refined, and the model may not yet be fully optimized for production use. Your feedback and contributions are welcome as we continue to improve this project.

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

- Python 3.x
- Libraries:
  - TensorFlow / Keras
  - NumPy
  - OpenCV
  - Matplotlib
  - scikit-learn
    
## Directory structure
```
dr-detection/
│
├── dataset/
│   ├── train/
│   │   ├── class_0/
│   │   ├── class_1/
│   │   ├── class_2/
│   │   ├── class_3/
│   │   └── class_4/
│   │
│   ├── val/
│   │   ├── class_0/
│   │   ├── class_1/
│   │   ├── class_2/
│   │   ├── class_3/
│   │   └── class_4/
│   │
│   └── test/
│       ├── class_0/
│       ├── class_1/
│       ├── class_2/
│       ├── class_3/
│       └── class_4/
│
├── MA.py
├── SplitDataset.py
└── training.ipynb
```
### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dr-detection.git
   cd dr-detection
   ```
2. Install the required package
   ```bash
   pip install -r requirements.txt

## Usage
1. Place your dataset in the designated folder (see directory structure).
2. Run the `training.ipynb` notebook to start training the model.
3. Monitor the training process for accuracy and loss metrics.

## Model Training
The model training involves several key steps:
-Data Preprocessing: Images are resized, normalized, and augmented to improve model performance.
- Model Architecture: A convolutional neural network is designed to classify images into different DR stages.
- Training: The model is trained on a designated dataset, with validation to avoid overfitting.

## Evaluation
After training, evaluate the model's performance using metrics such as accuracy, precision, recall, and F1-score. The results will be displayed in the training notebook.

## Contributing
Contributions are welcome! If you have suggestions for improvements, please fork the repository and submit a pull request.
