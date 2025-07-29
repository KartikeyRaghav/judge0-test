const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
// const JUDGE0_API_URL = "http://localhost:2358";

// Note: In a real application, you should store API keys securely
// For demo purposes, we'll use environment variables or allow users to input them
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "";

interface SubmissionData {
  source_code: string;
  language_id: number;
  stdin?: string;
}

interface SubmissionResponse {
  token: string;
}

interface SubmissionResult {
  stdout: string;
  stderr: string;
  compile_output: string;
  message: string;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

export class Judge0Service {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY;
  }

  async submitCode(data: SubmissionData): Promise<string> {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": this.apiKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify(data),
    };
    console.log(JSON.stringify(data));
    const response = await fetch(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
      payload
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Submission failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const result: SubmissionResponse = await response.json();
    return result.token;
  }

  async getSubmissionResult(token: string): Promise<SubmissionResult> {
    const response = await fetch(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": this.apiKey,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get result: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const result: SubmissionResult = await response.json();
    return result;
  }

  async executeCode(data: SubmissionData): Promise<SubmissionResult> {
    const token = await this.submitCode(data);

    // Poll for result
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

      const result = await this.getSubmissionResult(token);

      // Status 1 and 2 are "In Queue" and "Processing"
      if (result.status.id > 2) {
        return result;
      }

      attempts++;
    }

    throw new Error("Execution timeout - the code took too long to execute");
  }
}
