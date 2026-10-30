# NextRole – Production-Ready AWS Career Platform

NextRole is a professional career accelerator engineered using Next.js 15, TypeScript, Tailwind CSS, and AWS Serverless services (S3, Textract, Lambda, API Gateway, DynamoDB, and Cognito).

---

## Architecture Overview

```
Next.js Frontend (Local/Amplify)
     │
     ▼ (Token Verification)
Amazon Cognito User Pool
     │
     ▼ (Secure Proxy)
Amazon API Gateway (HTTP API)
     │
     ▼ (Single Route Handler)
AWS Lambda (Node.js 20 Module)
     ├─► Amazon S3 (PDF Resumes Bucket)
     ├─► Amazon Textract (OCR Text Extraction)
     ├─► Google Gemini API (Profile Parser & Career Recommendations)
     └─► Amazon DynamoDB (NextRoleUsers Profiles Table)
```

---

## AWS Infrastructure Provisioning

### 1. Amazon Cognito Setup
1. Create a Cognito User Pool named `NextRoleUserPool`.
2. Add an App Client. 
   > [!IMPORTANT]
   > Under **App Client Settings**, enable **USER_PASSWORD_AUTH** (User Password Authentication) so custom login and sign-up pages can communicate with Cognito APIs directly from standard web requests.
3. Configure Hosted UI settings to enable federated Google logins. Add `http://localhost:3000/callback` as an Allowed Redirect URI.

### 2. Amazon S3 Bucket Provisioning
Create a secure S3 bucket named `nextrole-resumes-<YOUR-AWS-ACCOUNT-ID>` to hold PDF documents. Ensure public access blocks are enabled and object uploads are restricted to `application/pdf`.

### 3. Amazon DynamoDB Provisioning
Create a single DynamoDB table named `NextRoleUsers` with:
- **Partition Key**: `email` (Type: String)
- Keep default settings.

### 4. IAM Permissions for AWS Lambda
Create a custom IAM execution role named `NextRoleLambdaExecutionRole` and attach the following policy document. This provides access to S3, Textract, DynamoDB, and CloudWatch Logs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::nextrole-resumes-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "textract:DetectDocumentText",
        "textract:StartDocumentTextDetection",
        "textract:GetDocumentTextDetection"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/NextRoleUsers"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

---

## Backend Deployment (AWS Lambda)

1. Navigate to the `lambda` directory:
   ```bash
   cd lambda
   ```
2. Build and bundle the TS application:
   ```bash
   npm install
   npm run build
   ```
   This will output a single minified bundle inside `lambda/dist/index.js` containing all node dependencies.
3. Zip the output file:
   - On Windows (PowerShell):
     ```powershell
     Compress-Archive -Path dist/index.js -DestinationPath lambda.zip -Update
     ```
4. Upload `lambda.zip` to AWS Lambda, configured with runtime **Node.js 20** and entry point **index.handler**.
5. Set environment variables on the AWS Lambda configuration page:
   - `S3_BUCKET`: `nextrole-resumes-<YOUR-AWS-ACCOUNT-ID>`
   - `DYNAMODB_TABLE`: `NextRoleUsers`
   - `GEMINI_API_KEY`: `<YOUR_GOOGLE_GEMINI_API_KEY>`

---

## API Gateway Route Integrations

Create an **API Gateway HTTP API** mapping all proxy requests to the Lambda function.
1. Add an Integration targeting your `NextRole` Lambda.
2. Configure CORS under Gateway settings:
   - **Allowed Origins**: `http://localhost:3000`
   - **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
   - **Allowed Headers**: `Content-Type, Authorization`
   - **Expose Headers**: `ETag`
3. Map the stage path `/` directly to stage `prod` (production stage) and copy the API endpoint URL.

---

## Local Development Configuration

1. Create a `.env.local` file at the project root containing your live AWS endpoints and client ids:
   ```env
   NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com
   NEXT_PUBLIC_REGION=<aws-region>
   NEXT_PUBLIC_USER_POOL_ID=<aws-region>_xxxxxx
   NEXT_PUBLIC_CLIENT_ID=<app-client-id>
   NEXT_PUBLIC_COGNITO_DOMAIN=<your-auth-domain>.auth.<region>.amazoncognito.com
   NEXT_PUBLIC_COGNITO_REDIRECT_URI=http://localhost:3000/callback
   ```
2. Clean your development cache and run the local development server:
   ```bash
   npm run dev
   ```
3. Verify your changes compile perfectly for production deployment:
   ```bash
   npm run build
   ```
