````markdown
# 🌐 Next.js Assisted WayFinding Project with Soul Machines Integration

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It includes API integrations for Soul Machines and is ready for rapid development and deployment.

## 🚀 Minimum Requirements

-   **Node.js v20**

## 🛠️ Getting Started

Follow the steps below to set up the project:

### 1️⃣ Install Packages

First, install the necessary packages:

```bash
npm i
```
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

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the creators of Next.js.

For detailed instructions on deploying, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
