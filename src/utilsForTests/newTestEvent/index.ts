import { APIGatewayProxyEvent } from 'aws-lambda';

function newTestEvent(body: string): APIGatewayProxyEvent {
  // @ts-ignore // ignoring all the other attributes that should be on an APIGatewayProxyEvent (not needed for these tests)
  return { body, httpMethod: 'POST' };
}

export default newTestEvent;
