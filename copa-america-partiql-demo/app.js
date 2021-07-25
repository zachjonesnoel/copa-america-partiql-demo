let response;
const AWS = require("aws-sdk")
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

exports.lambdaHandler = async(event, context) => {
    // console.log(JSON.stringify(event, null, 2))
    try {
        let res
        switch (event.resource) {
            case "/teams":
                res = await get_all_teams()
                break;
            case "/teams/{id}":
                res = await get_teams_details(event.pathParameters)
                break;
            case "/matches":
                res = await get_all_matches()
                break;
            case "/matches/{id}":
                res = await get_teams_matches(event.pathParameters)
                break;
        }
        response = {
            'statusCode': 200,
            'body': JSON.stringify(res)
        }
    }
    catch (err) {
        console.log(err);
        return err;
    }

    return response
};

const get_all_teams = async() => {
    let partiqlStmt = {
        Statement: `SELECT * FROM "copa-america" WHERE "pk" = 'TEAM'`,
    }
    let response = await dynamodb.executeStatement(partiqlStmt).promise()
    return response
}

const get_teams_details = async(params) => {
    let partiqlStmt = {
        Statement: `SELECT * FROM "copa-america" WHERE "pk" = 'TEAM' AND contains("display_name",'${params.id}')`,
    }
    console.log(partiqlStmt)
    let response = await dynamodb.executeStatement(partiqlStmt).promise()
    return response
}

const get_teams_matches = async(params) => {
    let partiqlStmt = {
        Statement: `SELECT * FROM "copa-america" WHERE "pk" = 'MATCH' AND contains("display_name",'${params.id}')`,
    }
    console.log(partiqlStmt)
    let response = await dynamodb.executeStatement(partiqlStmt).promise()
    return response
}

const get_all_matches = async() => {
    let partiqlStmt = {
        Statement: `SELECT * FROM "copa-america" WHERE "pk" = 'MATCH'`,
    }
    let response = await dynamodb.executeStatement(partiqlStmt).promise()
    return response
}
