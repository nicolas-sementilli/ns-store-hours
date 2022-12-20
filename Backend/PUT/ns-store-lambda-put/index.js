const AWS = require('aws-sdk');

exports.handler = async (event) => {
  let resbody;
  // Set the region where your DynamoDB table is located
  AWS.config.update({ region: 'us-east-1' });

  // Create a DynamoDB client
  const dynamoDb = new AWS.DynamoDB();

  // Get the day, opened, and closed times from the event input
  const day = event.day;
  const opened = event.opened;
  const closed = event.closed;

  // Set the parameters for the update operation
  const params = {
    TableName: 'ns-business-hours',
    Key: {
      day: { S: day },
    },
    UpdateExpression: 'set opened = :o, closed = :c',
    ExpressionAttributeValues: {
      ':o': { S: opened },
      ':c': { S: closed },
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    // Update the opened and closed times for the specified day in the DynamoDB table
    const result = await dynamoDb.updateItem(params).promise();

    // Return the updated opened and closed times
    resbody = {
      opened: result.Attributes.opened.S,
      closed: result.Attributes.closed.S,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }

  // Set the CORS headers in the response
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(resbody),
  };
};
