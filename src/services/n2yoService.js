async function fetchN2yoService() {
  console.log("===N2yo-Service connection===");

  const url = `/api/n2yo/positions/42969/41.702/-76.014/0/2?apiKey=${
    import.meta.env.VITE_N2YO_API_KEY
  }`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error! Status:, ${response.status}`);
  }
  const data = await response.json();
  console.log("Raw N2yo Data:", data);

  return data;
}

export default fetchN2yoService;

// Service-Responsibility:
// Only fetch and pass on N2yo data
// Error-Handling in Component
