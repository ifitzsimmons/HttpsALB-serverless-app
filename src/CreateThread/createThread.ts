/* eslint-disable import/no-absolute-path */
import { DynamoDB } from 'aws-sdk';
import { CreateThreadEvent, LambdaEvent, LambdaResponse } from '../global';
import { getUserData } from '/opt/nodejs/getUserData';
import { formatResponse, formatError } from '/opt/nodejs/formatResponse';

const ddb = new DynamoDB.DocumentClient();
const TableName: string = <string>process.env.ForumTable;

/**
 * Validates that the thread is being posted to a valid Forum and
 * raises an Error it not
 *
 * @param forumName - Name of the thread's forum in normal form
 *                             (no spaces or special characters)
 */
const validateForumExists = async (forumName: string): Promise<void> => {
  const getItemParams: DynamoDB.DocumentClient.GetItemInput = {
    TableName,
    Key: {
      partitionKey: 'TYPE#FORUM',
      sortKey: `NAME#${forumName}`,
    },
  };

  const { Item } = await ddb.get(getItemParams).promise();

  if (!Item) {
    throw new Error(`Forum, "${forumName}", does not exist.`);
  }
};

/**
 * Adds a new thread to the DDB table.
 */
const postThread = async (
  { ForumName, ThreadTitle, Message, PostedTime }: CreateThreadEvent,
  user: string
): Promise<void> => {
  const time = PostedTime
    ? new Date(PostedTime).toISOString()
    : new Date().toISOString();

  const threadKey: string = ThreadTitle.replace(/[^a-zA-Z]/g, '');
  const forumKey: string = ForumName.replace(/[^a-zA-Z]/g, '');

  await validateForumExists(forumKey);

  const putParams: DynamoDB.DocumentClient.PutItemInput = {
    TableName,
    Item: {
      partitionKey: `FORUM#${forumKey}`,
      sortKey: `THREAD#${threadKey}`,
      Message,
      user,
      LastUpdatedTime: time,
      Replies: 0,
      threadReplySortKey: `0#${time}-${threadKey}`,
      threadDatetimeSortKey: `${time}#${threadKey}`,
      ForumName,
      ThreadTitle,
    },
    ConditionExpression: '#pk <> :partitionKey AND #sk <> :sortKey',
    ExpressionAttributeNames: {
      '#pk': 'partitionKey',
      '#sk': 'sortKey',
    },
    ExpressionAttributeValues: {
      ':partitionKey': `FORUM#${forumKey}`,
      ':sortKey': `THREAD#${threadKey}`,
    },
  };

  try {
    await ddb.put(putParams).promise();
  } catch (ex) {
    if (ex.code === 'ConditionalCheckFailedException') {
      ex.message = `Thread, "${ThreadTitle}", already exists for Forum, "${ForumName}".`;
    }
    throw ex;
  }
};

/**
 * Service for posting a new thread to a forum.
 *
 * @param event - Lambda invocation data
 * @return  status of 200 for a succesful request and -1 otherwise. If there's
 *          an error, information will be available via the `error` property
 */
module.exports.handler = async (
  event: LambdaEvent
): Promise<LambdaResponse> => {
  console.log('EVENT: ', JSON.stringify(event));

  const body: CreateThreadEvent = JSON.parse(event.body);
  const { email } = await getUserData(event.headers['x-amzn-oidc-data']);

  try {
    await postThread(body, email);
    return formatResponse(
      `${body.ThreadTitle} added to Forum, "${body.ForumName}"`
    );
  } catch (ex) {
    console.error(ex);
    return formatError(ex);
  }
};
