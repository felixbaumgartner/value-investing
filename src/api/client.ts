const FMP_BASE_URL = "https://financialmodelingprep.com/stable";

function getApiKey(): string {
  const key = import.meta.env.VITE_FMP_API_KEY;
  if (!key) {
    throw new ApiError(
      "FMP API key not configured. Create a .env file with VITE_FMP_API_KEY=your_key",
      0,
      ""
    );
  }
  return key;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fmpFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${FMP_BASE_URL}${endpoint}`);
  url.searchParams.set("apikey", getApiKey());
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 429) {
      throw new ApiError(
        "API rate limit reached. Free tier allows 250 requests/day.",
        429,
        endpoint
      );
    }
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status,
      endpoint
    );
  }

  const data = await response.json();

  if (Array.isArray(data) && data.length === 0) {
    throw new ApiError(
      "No data found for this ticker symbol",
      404,
      endpoint
    );
  }

  if (data && typeof data === "object") {
    const errorMessage = ["Error Message", "error", "message"]
      .map((key) => (data as Record<string, unknown>)[key])
      .find((value): value is string => typeof value === "string" && value.length > 0);

    if (errorMessage) {
      throw new ApiError(errorMessage, 400, endpoint);
    }
  }

  return data as T;
}
