import { DynamoDB } from 'aws-sdk';

interface ForumData {
  ForumName: string;
}

type LambdaEvent = {
  body: string;
  isBase64Encoded: boolean;
  headers: any;
};

interface LambdaResponse {
  statusCode: number;
  statusDescription?: string;
  headers: Record<string, unknown>;
  isBase64Encoded: boolean;
  // JSON Parse-able
  body: string;
}

type ForumTableKey = {
  partitionKey: string;
  sortKey: string;
};

interface CreateReplyEvent extends ForumData {
  ThreadTitle: string;
  Message: string;
  PostedTime: string;
}

interface CreateThreadEvent extends ForumData {
  ThreadTitle: string;
  Message: string;
  PostedTime: string;
}

// TABLE ITEMS
interface ThreadItem extends DynamoDB.DocumentClient.AttributeMap {
  ForumName: string;
  ThreadTitle: string;
  partitionKey: string;
  sortKey: string;
  Message: string;
  User: string;
  LastUpdateTime: number;
  Replies: number;
  threadReplySortKey: string;
  threadTimeSortKey: string;
}
