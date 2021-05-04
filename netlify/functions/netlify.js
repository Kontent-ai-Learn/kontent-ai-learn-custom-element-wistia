exports.handler = async (event, context) => {
    const location = event.queryStringParameters.location || "home";

    return {
        statusCode: 200,
        body: `${location}`,
    };
};