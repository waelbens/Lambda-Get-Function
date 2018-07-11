const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-east-2', apiVersion: '2012-08-10'});
const cisp = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

exports.handler = (event, context, callback) => {
    const acessToken = event.acessToken;
    
    const type=event.type
    if (type==='all') {
        const params = {
            TableName: 'bill-yourself'
        }
        dynamodb.scan(params, function(err, data){
            if (err){
                console.log(err);
                callback(err);
            } else {
                console.log(data);
                const items = data.Items.map(
                    (dataField) => {
                        return {days: +dataField.days.N , income: +dataField.income.N};
                    }
                    );
                callback(null, items);
            }
        });
    } else if (type=== 'single') {
        const cispParams = {
            "AccessToken": acessToken
        };
        
        cisp.getUser(cispParams, (err, result) => {
             if (err){
                console.log(err);
                callback(err);
            } else {
                console.log(result);
                const userID = result.UserAttributes[0].Value;
                        const params = {
                            Key: {
                                "userID": {
                                    S: userID
                                }
                            },
                            TableName: 'bill-yourself'
                        };
                        dynamodb.getItem(params, function(err, data){
                             if (err){
                                console.log(err);
                                callback(err);
                            } else {
                                console.log(data);
                                callback(null, {days: +data.Item.days.N, income: +data.Item.income.N});
                            }
                            
                        });
                            }            
            
        });

    } else {
        callback(null, 'ERROR !');
    }
};
