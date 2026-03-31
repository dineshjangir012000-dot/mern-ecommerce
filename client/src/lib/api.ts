const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  

  if (!response.ok) {
    console.log("error in response ")
    const error = await response.json();
    throw error;
  }
  
//   const BASE_URL = import.meta.env.VITE_API_URL;

// export async function apiRequest(
//   endpoint: string,
//   options: RequestInit = {}
// ) {
//   const token = localStorage.getItem("token");

//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//     },
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw error;
//   }

//   return response.json();
// }


  return response.json();
}
