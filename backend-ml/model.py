# import tensorflow as tf
# from tensorflow import keras
# from tensorflow.keras.preprocessing.text import Tokenizer
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# import numpy as np
# import json

# # Load mock dataset
# data = [
#     {"signs_and_symptoms": "Fever, cough, shortness of breath", "diagnosis": "Pneumonia"},
#     {"signs_and_symptoms": "Headache, nausea, sensitivity to light", "diagnosis": "Migraine"},
#     {"signs_and_symptoms": "Frequent urination, excessive thirst, fatigue", "diagnosis": "Diabetes Mellitus"},
#     {"signs_and_symptoms": "Sore throat, runny nose, sneezing", "diagnosis": "Common Cold"},
#     {"signs_and_symptoms": "Chest pain, shortness of breath, sweating", "diagnosis": "Heart Attack"}
# ]

# # Extract features and labels
# texts = [entry["signs_and_symptoms"] for entry in data]
# labels = [entry["diagnosis"] for entry in data]

# # Tokenize symptoms
# tokenizer = Tokenizer()
# tokenizer.fit_on_texts(texts)
# sequences = tokenizer.texts_to_sequences(texts)
# word_index = tokenizer.word_index

# # Pad sequences
# max_length = max(len(seq) for seq in sequences)
# X = pad_sequences(sequences, maxlen=max_length, padding='post')

# # Encode labels
# label_index = {label: idx for idx, label in enumerate(set(labels))}
# y = np.array([label_index[label] for label in labels])

# # Define model
# model = keras.Sequential([
#     keras.layers.Embedding(input_dim=len(word_index) + 1, output_dim=16, input_length=max_length),
#     keras.layers.GlobalAveragePooling1D(),
#     keras.layers.Dense(16, activation='relu'),
#     keras.layers.Dense(len(label_index), activation='softmax')
# ])

# model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# # Train model
# model.fit(X, y, epochs=10, verbose=1)

# # Save model
# model.save("health_diagnosis_model.h5")

# # Save tokenizer and label index
# with open("tokenizer.json", "w") as f:
#     json.dump(tokenizer.to_json(), f)

# with open("label_index.json", "w") as f:
#     json.dump(label_index, f)

# print("Model training complete. Saved as health_diagnosis_model.h5")
