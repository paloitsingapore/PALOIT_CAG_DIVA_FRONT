# 🌐 Next.js Assisted WayFinding Project with Soul Machines Integration

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It includes API integrations for Soul Machines and is ready for rapid development and deployment.

### Hyper-Realistic digital avatar
This project is a proof-of-concept (POC) using an integration with Soul Machines to generate a hyper-realistic digital avatar as part of the front-end application. The avatar engages with users through lifelike interactions, making use of advanced AI-driven facial expressions, gestures, and speech. Additionally, this project leverages an Orchestrator to manage and coordinate the interactions between the avatar, the back-end services, and other application components.

Soul Machines Avatar Integration

The front-end application uses Soul Machines to deliver an engaging, human-like digital avatar that interacts with users in real time. The avatar enhances user engagement through:

- Dynamic Facial Expressions: The avatar responds with realistic emotions and gestures based on the context of the conversation.
- AI-Driven Interactions: The avatar is powered by AI, which allows it to hold real-time conversations and adapt its responses accordingly.
- Seamless Front-End Integration: The Soul Machines avatar is embedded into the front-end interface using the Soul Machines SDK. This allows for easy customization of the avatar’s appearance, behavior, and functionality.

Orchestrator Concept

In this project, an Orchestrator is used to manage and coordinate the interaction between the Soul Machines avatar and the rest of the application. The orchestrator is responsible for ensuring smooth communication and synchronization across different system components, including:

- Front-End Integration: The orchestrator handles the coordination between the avatar’s real-time interactions and the UI, ensuring that user actions trigger appropriate responses from the avatar.
- Back-End Services: The orchestrator interfaces with back-end APIs and services, facilitating the exchange of data (such as user inputs, preferences, or context) that is used to inform the avatar’s responses.
- State Management: The orchestrator keeps track of the current state of the conversation or interaction, ensuring that the avatar behaves consistently across different user sessions and activities.

Why Use an Orchestrator?
- Modular Communication: The orchestrator decouples the avatar logic from the rest of the application, making the system more modular and easier to maintain.
- Centralized Control: It acts as a single point of control for all avatar-related operations, such as managing the flow of conversations, calling APIs, and handling UI updates.
-0 Scalability: By managing different components through an orchestrator, the system becomes more scalable, allowing for future enhancements like integrating additional AI services or extending the avatar’s capabilities.

## 🚀 Minimum Requirements

-   **Node.js v20**

## 🛠️ Getting Started

Follow the steps below to set up the project:

### 1️⃣ Install Packages

First, install the necessary packages:

```bash
npm i
````

### 2️⃣ Update Environment Variables ( API Keys and Soul Machines Configuration)

Before starting the development server, make sure to update the API keys and Soul Machines configuration:

-   Navigate to the `.env` file.
-   Update the following keys and configuration values:

    -   **NEXT_PUBLIC_API_BASE_URL**: This is the base URL for your API.
    -   **SOUL_MACHINE_API_KEY**: Add your Soul Machines API keys for each supported language.

#### Example `.env`:

```ts
# Backend API URL
NEXT_PUBLIC_API_BASE_URL='your backend api url'

# Soul Machines API Keys for different languages
NEXT_PUBLIC_SOUL_MACHINE_API_KEY_EN='your-soul-machines-api-key-for-english'
NEXT_PUBLIC_SOUL_MACHINE_API_KEY_ES='your-soul-machines-api-key-for-spanish'
NEXT_PUBLIC_SOUL_MACHINE_API_KEY_ZH='your-soul-machines-api-key-for-chinese'
```

### 3️⃣ Run the Development Server

Now you're ready to run the development server:

```bash
npm run dev
```

Once the server is running, open [http://localhost:3000](http://localhost:3000) in your browser to see your project live.

You can start editing the page by modifying `app/page.tsx`. Changes will automatically update in the browser as you save the file.

Then, run the build command:
```npm run build```
This will generate a static version of your site in the out directory.


To run the tests 
```bash
npm run test
````

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the creators of Next.js.

For detailed instructions on deploying, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 🚀 Deploy on AWS S3 static

- Go to the AWS S3 console and create a new bucket.
- Enable static website hosting in the bucket properties.
- Set the index document to index.html.
- Configure the bucket policy to allow public read access.
- Upload files to S3
- Upload the contents of the out directory to your S3 bucket. You can use the AWS CLI for this: 
-- aws s3 sync out s3://your-bucket-name
- Configure Cloudfront distribution

## Deploy with Amplify (current deployment method)

- Run `npm run build`
- Zip the content of the `out` folder not the `out` folder itself
- Upload the zip file as new amplify deployment in the console

### POC hosted on AWS 

##### PLEASE NOTE
To facilitate the exploration of the POC, PALO IT shares a working environement. 
This enviroment will be running until end of Novemeber.

The project use AWS Rekognition to recongnise the face of the Eldery passengers and propose personalised experience.

1 - use the backend to add Faces to the database and associate with a persona.

2 - Access the front end using this link
https://staging-v-2.d3q6ezxdh8nybd.amplifyapp.com

The UI is optimised for screens Ipad with 1366 x 1024 resolution.



### .env for the POC

Use these variables to configure localhost frontend to interact with the AWS backend

```
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://ed5zq5eya8.execute-api.ap-southeast-1.amazonaws.com/prod

# Soul Machines API Keys for different languages
NEXT_PUBLIC_SOUL_MACHINE_API_KEY_EN='eyJzb3VsSWQiOiJkZG5hLXJlZmxhdW50LXNpbmdhcG9yZWEwYjItLWNoYW5naWFzc2lzdGVkd2EiLCJhdXRoU2VydmVyIjoiaHR0cHM6Ly9kaC5zb3VsbWFjaGluZXMuY2xvdWQvYXBpL2p3dCIsImF1dGhUb2tlbiI6ImFwaWtleV92MV8zYmYzY2QyYS1jZjY2LTQwNmQtOGRlNC0zNjZhZmU5MGQ3MGYifQ=='
NEXT_PUBLIC_SOUL_MACHINE_API_KEY_ES='eyJzb3VsSWQiOiJkZG5hLXJlZmxhdW50LXNpbmdhcG9yZWEwYjItLXNwYW5pc2hjaGFuZ2lraW8iLCJhdXRoU2VydmVyIjoiaHR0cHM6Ly9kaC5zb3VsbWFjaGluZXMuY2xvdWQvYXBpL2p3dCIsImF1dGhUb2tlbiI6ImFwaWtleV92MV9lMTk0OWFmMC03ZDMzLTRjNDItODgyYi0yMDhlYjA5NGFhNmUifQ=='
NEXT_PUBLIC_SOUL_MACHINE_API_KEY_ZH='eyJzb3VsSWQiOiJkZG5hLXJlZmxhdW50LXNpbmdhcG9yZWEwYjItLWxvY2FsY2hhbmdpYXNzaXMiLCJhdXRoU2VydmVyIjoiaHR0cHM6Ly9kaC5zb3VsbWFjaGluZXMuY2xvdWQvYXBpL2p3dCIsImF1dGhUb2tlbiI6ImFwaWtleV92MV82NjMzOWMyNi1lZGFmLTQzYTUtYjg2MC0zNTE1ODA3YjYyNjIifQ=='
```
