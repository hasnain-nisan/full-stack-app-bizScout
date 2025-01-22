import { v4 as uuidv4 } from "uuid";

export const generateRandomPayload = (): Record<string, any> => {
  const regions = ["us-east-1", "us-west-2", "eu-central-1"];
  const environments = ["development", "staging", "production"];
  const priorities = ["low", "medium", "high"];

  return {
    requestId: uuidv4(), // Generate a unique request ID
    timestamp: new Date().toISOString(), // Current timestamp in ISO format
    source: "monitoring-service", // Static source identifier
    event: {
      type: "HTTP_CHECK",
      url: "https://example.com/api/health",
      method: "POST",
      headers: {
        Authorization: "Bearer sampleToken",
        "Content-Type": "application/json",
      },
      body: {
        userId: Math.floor(Math.random() * 10000).toString(), // Random userId (as string)
        action: "check_health",
        parameters: {
          region: regions[Math.floor(Math.random() * regions.length)], // Random region
          retries: Math.floor(Math.random() * 5) + 1, // Random retries (1 to 5)
        },
      },
    },
    metadata: {
      environment: environments[Math.floor(Math.random() * environments.length)], // Random environment
      priority: priorities[Math.floor(Math.random() * priorities.length)], // Random priority
      tags: ["monitoring", "api-check", "health-check"], // Static tags
    },
  };
};
