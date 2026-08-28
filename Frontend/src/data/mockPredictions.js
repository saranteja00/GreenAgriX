export const MOCK_PREDICTIONS = {
  Tomato: [
    { disease: "Early Blight (Alternaria solani)", diseaseTa: "ஆரம்பகால இலை கருகல் நோய் (Early Blight)", confidence: 94.6, isHealthy: false },
    { disease: "Late Blight (Phytophthora infestans)", diseaseTa: "பின்கால இலை கருகல் நோய் (Late Blight)", confidence: 93.2, isHealthy: false },
    { disease: "Tomato Leaf Curl Virus (ToLCV)", diseaseTa: "தக்காளி இலை சுருட்டு வைரஸ்", confidence: 92.8, isHealthy: false }
  ],
  Potato: [
    { disease: "Early Blight (Alternaria solani)", diseaseTa: "ஆரம்பகால இலை கருகல் நோய்", confidence: 94.2, isHealthy: false },
    { disease: "Late Blight (Phytophthora infestans)", diseaseTa: "பின்கால இலை கருகல் நோய்", confidence: 92.0, isHealthy: false }
  ],
  Maize: [
    { disease: "Common Rust (Puccinia sorghi)", diseaseTa: "மக்காச்சோள துரு நோய்", confidence: 92.5, isHealthy: false },
    { disease: "Northern Leaf Blight", diseaseTa: "வடக்கு இலை கருகல் நோய்", confidence: 91.8, isHealthy: false }
  ],
  Wheat: [
    { disease: "Yellow Rust (Puccinia striiformis)", diseaseTa: "மஞ்சள் துரு நோய்", confidence: 93.8, isHealthy: false },
    { disease: "Powdery Mildew (Blumeria graminis)", diseaseTa: "சாம்பல் நோய்", confidence: 92.1, isHealthy: false }
  ],
  Rice: [
    { disease: "Rice Blast (Magnaporthe oryzae)", diseaseTa: "நெல் குலைநோய் (Rice Blast)", confidence: 95.1, isHealthy: false },
    { disease: "Bacterial Leaf Blight", diseaseTa: "பாக்டீரியா இலை கருகல் நோய்", confidence: 93.4, isHealthy: false }
  ],
  Onion: [
    { disease: "Purple Blotch (Alternaria porri)", diseaseTa: "வெங்காய ஊதா இலைக்கருகல் நோய்", confidence: 94.0, isHealthy: false },
    { disease: "Stemphylium Leaf Blight", diseaseTa: "இலை கருகல் நோய்", confidence: 91.5, isHealthy: false }
  ],
  Brinjal: [
    { disease: "Phomopsis Blight (Phomopsis vexans)", diseaseTa: "கத்தரி இலை கருகல் நோய்", confidence: 93.6, isHealthy: false },
    { disease: "Little Leaf Disease", diseaseTa: "சிறிய இலை நோய்", confidence: 92.2, isHealthy: false }
  ],
  Chilli: [
    { disease: "Anthracnose (Die-back / Fruit Rot)", diseaseTa: "மிளகாய் நுனிகருகல் & பழ அழுகல் நோய்", confidence: 94.8, isHealthy: false },
    { disease: "Chilli Leaf Curl Virus", diseaseTa: "மிளகாய் இலை சுருட்டு நோய்", confidence: 93.0, isHealthy: false }
  ],
  Carrot: [
    { disease: "Alternaria Leaf Blight", diseaseTa: "கேரட் இலை கருகல் நோய்", confidence: 93.1, isHealthy: false },
    { disease: "Powdery Mildew (Erysiphe)", diseaseTa: "சாம்பல் நோய்", confidence: 91.7, isHealthy: false }
  ],
  Cotton: [
    { disease: "Bacterial Blight (Xanthomonas)", diseaseTa: "பருத்தி கோண இலைப்புள்ளி நோய்", confidence: 94.4, isHealthy: false },
    { disease: "Grey Mildew (Ramularia areola)", diseaseTa: "சாம்பல் பூஞ்சை நோய்", confidence: 92.6, isHealthy: false }
  ],
  Groundnut: [
    { disease: "Tikka Leaf Spot (Cercospora)", diseaseTa: "டிக்கா இலைப்புள்ளி நோய்", confidence: 95.0, isHealthy: false },
    { disease: "Groundnut Rust (Puccinia arachidis)", diseaseTa: "துரு நோய்", confidence: 93.3, isHealthy: false }
  ],
  Soybean: [
    { disease: "Frogeye Leaf Spot (Cercospora sojina)", diseaseTa: "தவளைக்கண் இலைப்புள்ளி நோய்", confidence: 93.7, isHealthy: false },
    { disease: "Soybean Rust (Phakopsora pachyrhizi)", diseaseTa: "சோயாபீன் துரு நோய்", confidence: 92.4, isHealthy: false }
  ]
};

export function predictCropHealth(cropId) {
  const options = MOCK_PREDICTIONS[cropId] || MOCK_PREDICTIONS.Tomato;
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}