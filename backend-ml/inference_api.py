from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained model
model = tf.keras.models.load_model("health_diagnosis_model_v2.h5")

# Load tokenizer
with open("tokenizer.json", "r") as f:
    tokenizer = tokenizer_from_json(json.load(f))

# Load label index
with open("label_index.json", "r") as f:
    label_index = json.load(f)
    # Ensure keys are ints for reverse lookup
    index_label = {int(v): k for k, v in label_index.items()}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    symptoms = data.get("signs_and_symptoms") or data.get("text")

    if not symptoms:
        return jsonify({"error": "Missing input text"}), 400

    print(f"📥 Received symptoms: {symptoms}")

    # Preprocess input
    seq = tokenizer.texts_to_sequences([symptoms])
    padded_seq = pad_sequences(seq, maxlen=model.input_shape[1], padding='post')

    # Make prediction
    prediction = model.predict(padded_seq)[0]
    predicted_index = int(np.argmax(prediction))
    predicted_label = index_label.get(predicted_index, "Unknown")
    confidence = float(np.max(prediction))

    return jsonify({
        "diagnosis": predicted_label,
        "confidence": confidence
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
