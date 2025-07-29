import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 1000, // virtual users
  duration: "60s", // run for 60 seconds
};

export default function () {
  const payload = JSON.stringify({
    language_id: 52, // e.g., Python (3.8.1)
    source_code: "print('Hello, World!')",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "2e46e44deamsh5856ec33604b22dp143504jsndd71fa5c8878",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
  };

  const res = http.post(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
    payload,
    params
  );

  check(res, {
    "status is 201": (r) => r.status === 201,
  });

  sleep(1);
}
