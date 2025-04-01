from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import json

# Load trained model
model = tf.keras.models.load_model("health_diagnosis_model.h5")

# Load tokenizer
with open("tokenizer.json", "r") as f:
    tokenizer = tokenizer_from_json(json.load(f))

# Load label index
with open("label_index.json", "r") as f:
    label_index = json.load(f)
    index_label = {v: k for k, v in label_index.items()}  # Reverse mapping

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    symptoms = data.get("signs_and_symptoms", "")

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    # Preprocess input
    seq = tokenizer.texts_to_sequences([symptoms])
    padded_seq = pad_sequences(seq, maxlen=model.input_shape[1], padding='post')

    # Make prediction
    prediction = model.predict(padded_seq)
    predicted_label = index_label[np.argmax(prediction)]

    return jsonify({"diagnosis": predicted_label})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
