import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from akave_api import listFiles, downloadFile

bucket_name = "telehealthsol-records-v2"

# Fetch and process records
def fetch_records():
    files_response = listFiles(bucket_name)
    records = []

    if not files_response.get("success"):
        print("❌ Failed to list files")
        return []

    files = files_response.get("data", [])

    for file_info in files:
        file_name = file_info.get("Name")
        if file_name and file_name.endswith(".json"):
            try:
                print(f"Downloading: {file_name}")
                record = downloadFile(bucket_name, file_name)
                records.append(record)
            except Exception as e:
                print(f"Failed to download {file_name}: {str(e)}")

    print(f"✅ Total downloaded records: {len(records)}")
    return records

# Get dataset
records = fetch_records()
texts = [rec["signsAndSymptoms"] for rec in records if "signsAndSymptoms" in rec and "diagnosis" in rec]
labels = [rec["diagnosis"] for rec in records if "signsAndSymptoms" in rec and "diagnosis" in rec]

print(f"Fetched {len(records)} records from Akave.")
print(f"Valid records for training: {len(texts)}")

if len(texts) == 0 or len(labels) == 0:
    print("🚫 No valid training data found. Check your Akave data.")
    exit()

# Tokenize symptoms
tokenizer = Tokenizer()
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
word_index = tokenizer.word_index
max_length = max(len(seq) for seq in sequences)
X = pad_sequences(sequences, maxlen=max_length, padding='post')

# Encode labels
label_index = {label: idx for idx, label in enumerate(set(labels))}
y = np.array([label_index[label] for label in labels])

# Define and train model
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=len(word_index)+1, output_dim=16, input_length=max_length),
    tf.keras.layers.GlobalAveragePooling1D(),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(len(label_index), activation='softmax')
])
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X, y, epochs=10)

# Save everything
model.save("health_diagnosis_model_v2.h5")
with open("tokenizer.json", "w") as f:
    json.dump(tokenizer.to_json(), f)
with open("label_index.json", "w") as f:
    json.dump(label_index, f)

print("✅ Trained and saved new model using Akave data!")
