import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          totalFiles: 0,
          totalSize: 0,
          files: []
        }),
      };
    }

    if (event.httpMethod === 'DELETE') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Cache cleared successfully',
          deletedFiles: 0
        }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
