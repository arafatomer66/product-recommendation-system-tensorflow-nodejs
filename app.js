const tf = require('@tensorflow/tfjs');

// Function to calculate the dot product of two arrays
function dotProduct(arr1, arr2) {
  return arr1.reduce((acc, val, i) => acc + val * arr2[i], 0);
}

// Function to calculate the similarity between user features and product features
function calculateSimilarity(userFeatures, productFeatures) {
  // Define weights for each feature (you can adjust these weights based on importance)
  const featureWeights = {
    category: 0.4,
    type: 0.3,
    price: 0.2,
    ratings: 0.1,
  };

  let totalWeightedSimilarity = 0;
  let totalWeight = 0;

  for (const key of Object.keys(userFeatures)) {
    if (key === 'price') {
      const priceDifference = Math.abs(userFeatures[key] - productFeatures[key]);
      const priceSimilarity = 1 / (1 + priceDifference);
      totalWeightedSimilarity += priceSimilarity * featureWeights[key];
      totalWeight += featureWeights[key];
    } else if (Array.isArray(userFeatures[key]) && Array.isArray(productFeatures[key])) {
      const featureSimilarity = dotProduct(userFeatures[key], productFeatures[key]);
      totalWeightedSimilarity += featureSimilarity * featureWeights[key];
      totalWeight += featureWeights[key];
    } else {
      totalWeightedSimilarity += userFeatures[key] === productFeatures[key] ? 1 * featureWeights[key] : 0;
      totalWeight += featureWeights[key];
    }
  }

  // Normalize the weighted similarity to the range [0, 1]
  const similarity = totalWeightedSimilarity / totalWeight;

  return similarity;
}

// Function to get personalized product recommendations for a user
function getRecommendations(userFeatures, products) {
  const recommendations = [];

  for (const product of products) {
    const similarity = calculateSimilarity(userFeatures, product.features);
    recommendations.push({
      productId: product.id,
      productName: product.name,
      similarity,
    });
  }

  // Sort recommendations by similarity in descending order
  recommendations.sort((a, b) => b.similarity - a.similarity);

  return recommendations;
}

// Sample dataset - products and their features
const products = [
  {
    id: '1',
    name: 'Product A',
    features: {
      category: 'electronics',
      type: 'smartphone',
      price: 800,
      ratings: [4.5, 4.2, 4.8],
    },
  },
  {
    id: '2',
    name: 'Product B',
    features: {
      category: 'clothing',
      type: 'men',
      price: 50,
      ratings: [3.8, 4.0, 3.5],
    },
  },
  {
    id: '3',
    name: 'Product C',
    features: {
      category: 'electronics',
      type: 'headphones',
      price: 150,
      ratings: [4.2, 4.7, 4.6],
    },
  },
  // Add more products...
];

// Sample user features
const userFeatures = {
  category: 'electronics',
  type: 'smartphone',
  price: 600,
  ratings: [4.7, 4.4, 4.9],
};

const recommendations = getRecommendations(userFeatures, products);
console.log(recommendations);
