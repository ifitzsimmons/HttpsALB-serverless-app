/* eslint-disable import/no-absolute-path */
import { DynamoDB } from 'aws-sdk';
import { LambdaEvent, LambdaResponse } from '../global';
import { formatResponse, formatError } from '/opt/nodejs/formatResponse';

const ddb = new DynamoDB.DocumentClient();
const TableName = <string>process.env.ForumTable;

/**
 * Returns a list of all of the Forums stored in the WebForum table.
 */
const getAllForums = async () => {
  const queryParams = {
    TableName,
    KeyConditionExpression: 'partitionKey = :name',
    ExpressionAttributeValues: {
      ':name': 'TYPE#FORUM',
    },
    ProjectionExpression: 'ForumName',
  };

  const { Items } = await ddb.query(queryParams).promise();

  const forumNames = Items?.map(({ ForumName }) => ForumName);
  return forumNames;
};

/**
 * Service for retrieving all of the available forums.
 *
 * @param event - Lambda invocation event
 * @return status of 200 for a succesful request and -1 otherwise. If there's
 *         an error, information will be available via the `error` property.
 *         `payload` property consists of a list of Forum Names.
 */
module.exports.handler = async (
  event: LambdaEvent
): Promise<LambdaResponse> => {
  console.log('EVENT: ', JSON.stringify(event));

  try {
    const forums = await getAllForums();
    return formatResponse(forums);
  } catch (ex) {
    return formatError(ex);
  }
};
