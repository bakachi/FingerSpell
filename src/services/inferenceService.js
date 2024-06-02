import { InputError } from "../exceptions/InputError.js";
import tf from "@tensorflow/tfjs-node";

function getLetterFromPrediction(prediction) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[prediction];
}

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();

    const predictedIndex = score.indexOf(Math.max(...score));

    const result = getLetterFromPrediction(predictedIndex);

    const suggestion = `Huruf ${result}`;

    return { predictedIndex, result, suggestion };
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

export default predictClassification;
