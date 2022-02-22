# HttpsALB-serverless-app

I love developing TypeScript Applications. I hate deploying TypeScript applications to AWS Lambda.

This project serves as an example for deploying TypeScript applications to AWS using a little bit of custom configuration and the [serverless framework](https://www.serverless.com/).

For a better understanding of the project, I suggest reading the associated articles: 
1. **[Authenticate Lambda Requests with ALB and Google OAuth: Part 1](https://ifitzsimmons.medium.com/authenticate-lambda-requests-with-alb-and-google-oauth-part-1-751b96f4c517)**.
2. **[Authenticate Lambda Requests with ALB and Google OAuth: Part 2](https://ifitzsimmons.medium.com/authenticate-lambda-requests-with-alb-and-google-oauth-part-2-955884480916)

## Get Started

If you learn by doing, install the project dependencies and run either one of the following commands:

```bash
$ yarn build-deploy
$ npm run build-deploy
```

This command will build the TypeScript services defined in the `src/` directory and deploy them to AWS. When you go to the CloudFormation service in the AWS Console, you'll see a new stack named `web-forum-ts-dev`, which is defined in the `serverless.yml`. The stack will contain THREE main resources:

1. **ForumThreads**: DynamoDB Table.
2. **CreateForumLambdaFunction**: AWS Lambda Function.
3. **CreateThreadLambdaFunction**: AWS Lambda Function.

To test the functions, here's some sample input

```json
// Create Forum
{
  "ForumName": "Fix The Title",
  "User": "Jane Doe",
}

// Create Thread
{
  "ForumName": "Fix The Title",
  "ThreadTitle": "NewThread",
  "User": "Jane Doe",
  "PostedTime": "2021-01-01T22:00:00.000",
  "Message": "First thread!!!"
}
```

Please note that the `ForumName` provided in the payload for the _CreateThread_ Lambda must be a valid Forum Name, meaning it must exist in the table.

## Data Model

This application uses a DynamoDB Single Table design pattern for its backend. I wrote an article explaining how I modeled the data for this application, and if you're interested, you can read that [here](https://ifitzsimmons.medium.com/single-table-dynamodb-data-modeling-63d9c742942c).

## Project Contents

To minimize the risk of information overload, this release contains just two Lambda services:

1. Create a new _Forum_.
2. Create a new _Thread_ within an established _Forum_.

Additionally, I left out unit tests and formatters/linters so that we can focus on the important files for deploying our TypeScript application.
