export const handler = async (event) => {
  const path = event.rawPath || event.path || "/";
  const method = event.requestContext?.http?.method || event.httpMethod || "GET";

  if (path === "/" && method === "GET") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: "Hello from the serverless Node.js app!//jonathan",
    };
  }

  if (path === "/health" && method === "GET") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "ok",
        source: "lambda",
        timestamp: new Date().toISOString(),
      }),
    };
  }

  return {
    statusCode: 404,
    headers: { "Content-Type": "text/plain" },
    body: `Not found: ${path}`,
  };
};
