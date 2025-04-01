import numpy as np
import tensorflow as tf
from tensorflow import keras

# Load the trained model
model = keras.models.load_model("health_diagnosis_model.h5")

# Define sample input (Signs/Symptoms)
sample_input = ["Fever, headache, muscle pain"]

# Convert input to numerical format (assuming tokenizer was used)
# Replace this with actual preprocessing if needed
tokenizer = keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(sample_input)
input_data = tokenizer.texts_to_matrix(sample_input, mode="binary")

# Predict the diagnosis
prediction = model.predict(np.array([input_data[0]]))

# Decode prediction (assuming classes were mapped)
classes = ["Flu", "Cold", "COVID-19", "Malaria", "Typhoid"]  # Example classes
predicted_label = classes[np.argmax(prediction)]

print(f"Predicted Diagnosis: {predicted_label}")
