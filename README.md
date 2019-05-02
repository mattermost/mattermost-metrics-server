# Mattermost Metrics Server ![CircleCI branch](https://img.shields.io/circleci/project/github/mattermost/mattermost-metrics-server/master.svg)

This is the metrics server for collecting performance data and trace events of Mattermost application, primarily setup for Android mobile app.

This is a serverless application built on top of AWS API Gateway and AWS Lambda with data storage in PostgreSQL.

Once deployed to AWS, the API can be accessed using the generated URL and its API key.

#### Offline/local development

```
npm run serve
```

#### Deploy

```
npm run deploy:production
```

#### API endpoints and expected output
- ``GET /``
```bash
curl --request GET \
  --url <TELEMETRY_URL>/ \
  --header 'x-api-key: <TELEMETRY_API_KEY>'
```
Output: Should returned message as "I'm alive"

- ``POST /metric``
```bash
curl --request POST \
  --url <TELEMETRY_URL>/metric \
  --header 'content-type: application/json' \
  --header 'x-api-key: <TELEMETRY_API_KEY>' \
  --data @fixtures/raw_metrics.json
```
Output: Should returned message as "Successfully saved"

- ``GET /metrics?page=0&per_page=100``
```bash
curl --request GET \
  --url <TELEMETRY_URL>/metrics \
  --header 'x-api-key: <TELEMETRY_API_KEY>'
```
Output: Should list of metrics, like
```json
{metrics: [...]}
```

- ``GET /metric/{id}``
```bash
curl --request GET \
  --url <TELEMETRY_URL>/metric/<METRIC_ID> \
  --header 'x-api-key: <TELEMETRY_API_KEY>'
```
Output: Should returned one metric matching the ID

- ``GET /traces/{device_unique_id}?chrome=true&page=0&per_page=100``
```bash
curl --request GET \
  --url <TELEMETRY_URL>/traces/<DEVICE_UNIQUE_ID> \
  --header 'x-api-key: <TELEMETRY_API_KEY>'
```
Output: Should returned trace events compatible with `chrome://tracing`

Note: Each endpoint requires API key to access. It's forbidden if not provided or invalid.


