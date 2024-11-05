import tensorflow as tf
import cv2
import os

def serialize_example(image_string, label):
    feature = {
        'image': tf.train.Feature(bytes_list=tf.train.BytesList(value=[image_string])),
        'label': tf.train.Feature(int64_list=tf.train.Int64List(value=[label])),
    }
    example_proto = tf.train.Example(features=tf.train.Features(feature=feature))
    return example_proto.SerializeToString()


def create_tfrecord(data_dir, tfrecord_filename):
    class_names = sorted(os.listdir(data_dir))  # Ensure consistent class order
    with tf.io.TFRecordWriter(tfrecord_filename) as writer:
        for label, class_name in enumerate(class_names):
            class_dir = os.path.join(data_dir, class_name)
            for filename in os.listdir(class_dir):
                image_path = os.path.join(class_dir, filename)
                if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                    continue  # Skip non-image files
                # Read and encode the image
                image = cv2.imread(image_path)
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB
                image_string = cv2.imencode('.jpg', image)[1].tobytes()  # Encode to JPEG
                example = serialize_example(image_string, label)
                writer.write(example)
    print(f'TFRecord created: {tfrecord_filename}')


if __name__ == "__main__":

    train_dir = "/media/mydisk/ICDCIT/Diabetic Retinopathy/Dataset_split/train"
    test_dir = "/media/mydisk/ICDCIT/Diabetic Retinopathy/Dataset_split/test"
    val_dir = "/media/mydisk/ICDCIT/Diabetic Retinopathy/Dataset_split/validation"

    output_dir = "/media/ritika/mydisk/ICDCIT/Diabetic Retinopathy/TFRecords"  

    os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
    create_tfrecord(train_dir, os.path.join(output_dir, 'train.tfrecord'))
    create_tfrecord(val_dir, os.path.join(output_dir, 'val.tfrecord'))
    create_tfrecord(test_dir, os.path.join(output_dir, 'test.tfrecord'))
