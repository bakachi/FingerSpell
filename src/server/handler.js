import predictClassification from "../services/inferenceService.js";
import crypto from "crypto";
import { storeData, predictionsCollection } from "../services/dataService.js";

async function postPredict(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  // Mendapatkan prediksi dari model
  const { predictedIndex, result, suggestion } = await predictClassification(
    model,
    image
  );

  // Menghasilkan ID unik untuk prediksi
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result,
    suggestion,
    createdAt,
  };

  // Menyimpan data prediksi
  await storeData(id, data);

  return h
    .response({
      status: "success",
      message:
        predictedIndex >= 0
          ? "Model predicted successfully."
          : "Prediction failed. Please try again.",
      data,
    })
    .code(201);
}

async function getPredictHistories(request, h) {
  const histories = (await predictionsCollection.get()).docs.map((doc) =>
    doc.data()
  );
  const data = histories.map((item) => ({
    id: item.id,
    history: item,
  }));
  return h.response({ status: "success", data }).code(200);
}

export default { postPredict, getPredictHistories };
