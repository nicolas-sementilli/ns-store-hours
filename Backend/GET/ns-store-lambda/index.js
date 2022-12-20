const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Retrieve all items from the table
  const scanParams = {
    TableName: 'ns-business-hours',
  };
  const scanResult = await dynamodb.scan(scanParams).promise();

  // Get the items from the result
  const items = scanResult.Items;
  console.log(items);

  const sortedBusinessHours = items.sort((a, b) => {
    // Convert the day strings to integers, with Monday being 0 and Sunday being 6
    const dayIntA = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ].indexOf(a.day);
    const dayIntB = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ].indexOf(b.day);

    // Sort the days in ascending order
    return dayIntA - dayIntB;
  });

  return sortedBusinessHours;
};
