import tensorflow as tf
import cv2
import os
from tqdm import tqdm  # For progress bars

def serialize_example(image_string, label):
    """
    Serialize image and label into a TFRecord-compatible format.

    Args:
        image_string (bytes): Encoded image in bytes.
        label (int): Label corresponding to the image.

    Returns:
        bytes: Serialized example.
    """
    feature = {
        'image': tf.train.Feature(bytes_list=tf.train.BytesList(value=[image_string])),
        'label': tf.train.Feature(int64_list=tf.train.Int64List(value=[label])),
    }
    example_proto = tf.train.Example(features=tf.train.Features(feature=feature))
    return example_proto.SerializeToString()


def create_tfrecord(data_dir, tfrecord_filename):
    """
    Create a TFRecord file from images and labels in the specified directory.

    Args:
        data_dir (str): Directory containing class subfolders.
        tfrecord_filename (str): Path to the output TFRecord file.
    """
    class_names = sorted(os.listdir(data_dir))  # Ensure consistent class order
    with tf.io.TFRecordWriter(tfrecord_filename) as writer:
        for label, class_name in enumerate(class_names):
            class_dir = os.path.join(data_dir, class_name)
            filenames = os.listdir(class_dir)
            for filename in tqdm(filenames, desc=f"Processing {class_name}", unit="file"):
                image_path = os.path.join(class_dir, filename)
                if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                    continue  # Skip non-image files
                try:
                    # Read and encode the image
                    image = cv2.imread(image_path)
                    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB
                    image_string = cv2.imencode('.jpg', image)[1].tobytes()  # Encode to JPEG
                    example = serialize_example(image_string, label)
                    writer.write(example)
                except Exception as e:
                    print(f"Error processing {image_path}: {e}")
    print(f'TFRecord created: {tfrecord_filename}')


if __name__ == "__main__":
    train_dir = "/media/mydisk/ICDCIT/Split_APTOS_preprocessed/train"
    test_dir = "/media/mydisk/ICDCIT/Split_APTOS_preprocessed/test"
    val_dir = "/media/mydisk/ICDCIT/Split_APTOS_preprocessed/val"

    output_dir = "/media/mydisk/ICDCIT/TFRecords_preprocessed_APTOS"  

    os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists

    print("Creating TFRecords...")
    # create_tfrecord(train_dir, os.path.join(output_dir, 'train.tfrecord'))
    create_tfrecord(val_dir, os.path.join(output_dir, 'val.tfrecord'))
    create_tfrecord(test_dir, os.path.join(output_dir, 'test.tfrecord'))
    print("TFRecord creation completed.")
