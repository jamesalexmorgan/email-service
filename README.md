# Ultimate Email Service

This is a RESTful api for sending emails.

## Using the service

The current live api endpoint is at the url...

    https://1apdfrxcte.execute-api.ap-southeast-2.amazonaws.com/dev/v1/send-email
    
You can test the api point now by pasting this command below (replace your email address) into your terminal...

    curl --header "Content-Type: application/json" \
      --request POST \
      --data '{"to":"John Smith<youremailaddresshere@gmail.com>","from":"Jim Jones<jim@jones.com>","subject":"Something awesome has happened","text":"You sent an email"}' \
      https://1apdfrxcte.execute-api.ap-southeast-2.amazonaws.com/dev/v1/send-email

As you can see the url currently recieves POST requests with the Content-Type "application/json", with the following possible attributes sent in the JSON body...

    {
      "to": "Jim Jones<youremailaddress@here.com>,yourotheremailaddress@here.com", // required, email addresses comma separated
      "cc": "theiremailaddress@here.com,theirotheremailaddress@here.com", // email addresses comma separated
      "bcc": "anotheremailaddress@here.com,yetanotheremailaddress@here.com", // email addresses comma separated
      "from": "John Smith<john@smith.com>", // required, a single email address
      "subject": "Our latest offer!", // The subject of the email
      "text": "Details about our offer...", // required, the text body of the email
    }

NOTE: an "email address" can be in the format either "Jim Jones<jim@jones.com>" or "jim@jones.com"

## Under the hood

Behind the scenes it has the behaviour...
- Customer submits POST to lambda 'customerEntryPoint' (via API gateway)
  - validates the input and returns good/bad response
  - If valid, add a message containing this, to an SQS queue 'sendQueue'
- sendQueue will invoke 'sendEmail' lambda, which will
  - Attempt to send the email via Mailgun api (capped 5 second wait)
  - If Mailgun fails, then attempt to send the email via SendGrid api (capped 5 second wait)
  - If both failed, then return to SQS a failure
- If failed, then try again every 30 seconds for 10 minutes


## Setup the environment

Install node modules...

    npm i -g yarn

In your IDE (preferrably VS Code) install the extensions for...
- Prettier
- ESLint
- Viewing cucumber .feature files

(When you load up this repo in VS Code, each of these will be automatically suggested)

#### Setup required for deploying your own

- Setup an AWS account
- Setup an new IAM user
  - Enable "Programmatic access"
  - For permissions, attach the existing policy "AdministratorAccess"
- Click create user and you should be shown the "Access key ID" and "Secret access key"
- Take a copy of these and save them into your AWS credentials file (on a Mac, the path is ~/.aws/credentials), with the contents like so...

    [personal]
    aws_access_key_id=AKIAUCH4ASDFGHJKL
    aws_secret_access_key=law+HQ5/asdfghjklasdfghjkl/OU4XSgs+jBk

(Now when we deploy, this "personal" profile specified in the serverless.yaml will be used to deploy the stack to this AWS account)

- Setup an account for MailGun, get an API key and a sandbox api url to use
  - Also, add your email address to your sandbox's "Authorized Recipients" (https://app.mailgun.com/app/sending/domains). You'll need this for any integration tests to work.

- Setup an account for SendGrid, get an API key to use
- Create a .env file (which won't get committed to the repo) and paste these 3 values into it like so...

    API_URL_MAILGUN='https://api.mailgun.net/v3/YourMailGunSandboxUrl.mailgun.org/messages'
    API_KEY_MAILGUN='YourMailGunApiKeyASDFGHJKLASDFGHJKL'
    API_KEY_SENDGRID='YourSendGridApiKeyASDFGHJKLASDFGHJKL'



## Running tests

### Unit tests

Run the following command to execute all unit tests...

    npm test

### Integration tests

These will fire some requests to check the deployed real lambda endpoint is working.

NOTE: you should add the email addresses in (src/integrationTests/sendEmail.test.integration.ts), to your MailGun sandbox's list of "Authorized Recipients"

Run the following command to execute all integration tests (tests with ".test.integration.ts" on the end)...

    npm run test-integration



## How to deploy

In order to deploy the whole stack (new SQS, new API gateway, new lambdas), run the command in your terminal...

    npm run deploy

### Quick code deploy

If you've already done a whole stack deploy, and you just want to do a quick deploy of just the lambda code, run this command...

    npm run deploy-functions



## TODO

Some things we couldn't quite get working in this demo...

- The scenario when both apis fail, the SQS queue should retry the lambda every 30 seconds but we couldn't get that working yet.

Some things, for the future...

- Support html field
- An integration test that check the email arrived - logs into gmail and checks if the email was received 🤔 At the mercy of Mailgun/SendGrid's delivery time (how long would you wait?)
- Guarenteed delivery - DynamoDB to record requests
- /email-status endpoint, where (providing a GUID) customers can check on the status of a particular email... while still in SQS queue 'pending', after giving up (after 50 times) 'failed'
- deploy additional dev/test environments with CI pipeline
- Create signup endpoint/page, account, subscription, service and monitor usage, allowing so many calls per month
- instead of using lambda env variables to store keys, store them somewhere like secrets manager?
- Dynamically populate the SQS_QUEUE_URL env variable in the serverless.yaml file
- Set up a dashboard to keep an eye on any failed api calls to MailGun/SendGrid to see if they're running ok