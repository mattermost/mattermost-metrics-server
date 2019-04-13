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
