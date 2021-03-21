/* eslint-disable import/no-absolute-path */
import { DynamoDB } from 'aws-sdk';
import { ForumData, LambdaEvent, LambdaResponse } from '../global';

import { getUserData } from '/opt/nodejs/getUserData';
import { formatResponse, formatError } from '/opt/nodejs/formatResponse';

const ddb = new DynamoDB.DocumentClient();
const TableName: string = <string>process.env.ForumTable;

/**
 * Adds a new Forum to the DynamoDB table
 *
 * @param ForumName - name of the forum that the thread belongs to
 * @param User - username of the user posting the reply
 */
const createForum = async (forumName: string, user: string): Promise<void> => {
  const forumKey: string = forumName.replace(/[^a-zA-Z]/g, '');

  const putParams: DynamoDB.DocumentClient.PutItemInput = {
    TableName,
    Item: {
      partitionKey: 'TYPE#FORUM',
      sortKey: `NAME#${forumKey}`,
      user,
      ForumName: forumName,
    },
    ConditionExpression: '#pk <> :partitionKey AND #sk <> :sortKey',
    ExpressionAttributeNames: {
      '#pk': 'partitionKey',
      '#sk': 'sortKey',
    },
    ExpressionAttributeValues: {
      ':partitionKey': 'TYPE#FORUM',
      ':sortKey': `NAME#${forumKey}`,
    },
  };

  try {
    await ddb.put(putParams).promise();
  } catch (ex) {
    if (ex.code === 'ConditionalCheckFailedException') {
      ex.message = `Forum, "${forumName}", already exists.`;
    }
    throw ex;
  }
};

/**
 * Service for creating a new forum.
 *
 * @param event - Lambda invocation data
 * @return {LambdaResponse}
 */
module.exports.handler = async (
  event: LambdaEvent
): Promise<LambdaResponse> => {
  console.log('EVENT: ', JSON.stringify(event));

  const { ForumName }: ForumData = JSON.parse(event.body);

  const { email } = await getUserData(event.headers['x-amzn-oidc-data']);

  try {
    await createForum(ForumName, email);
    return formatResponse(`${ForumName} successfully created`);
  } catch (ex) {
    return formatError(ex);
  }
};
