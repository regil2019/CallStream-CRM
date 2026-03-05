import axios from "axios";

const DADATA_API_KEY = process.env.DADATA_API_KEY;
const BASE_URL =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";

export const getCompanyByInn = async (inn: string) => {
  if (!DADATA_API_KEY) {
    console.warn("DADATA_API_KEY is not set. Skipping Dadata lookup.");
    return null;
  }

  try {
    const response = await axios.post(
      BASE_URL,
      { query: inn },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + DADATA_API_KEY,
        },
      },
    );

    return response.data.suggestions[0]?.data || null;
  } catch (error) {
    console.error("Dadata API Error:", error);
    return null;
  }
};
