// cebuBoundary.js
export const CEBU_BOUNDARY = {
  // Cebu province bounding box coordinates
  bounds: [
    [9.5, 123.0], // Southwest corner (lat, lng)
    [11.5, 124.5], // Northeast corner (lat, lng)
  ],

  // More precise polygon boundary for drawing restrictions
  polygon: [
    [10.3157, 123.8854], // Cebu City center
    [10.24, 123.8], // Southern boundary
    [10.45, 123.7], // Northern boundary
    [10.5, 124.0], // Eastern boundary
    [10.2, 124.1], // Western boundary
    // Add more precise coordinates for Cebu boundary
  ],
};

export const CEBU_CENTER = [10.3157, 123.8854]; // Cebu City center
