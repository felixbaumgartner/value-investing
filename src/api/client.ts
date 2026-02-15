const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

function getApiKey(): string {
  const key = import.meta.env.VITE_FINNHUB_API_KEY;
  if (!key) {
    throw new ApiError(
      "Finnhub API key not configured. Create a .env file with VITE_FINNHUB_API_KEY=your_key",
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

export async function finnhubFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`);
  url.searchParams.set("token", getApiKey());
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 429) {
      throw new ApiError(
        "API rate limit reached. Free tier allows 60 calls/minute.",
        429,
        endpoint
      );
    }
    if (response.status === 403) {
      throw new ApiError(
        "This endpoint requires a premium Finnhub subscription.",
        403,
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

  if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
    throw new ApiError(data.error, 400, endpoint);
  }

  return data as T;
}
