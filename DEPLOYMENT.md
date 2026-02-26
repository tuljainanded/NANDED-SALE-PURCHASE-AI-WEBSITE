# Deployment Guide: Nanded Sale Purchase

This guide provides instructions on how to configure and deploy the Next.js full-stack marketplace application.

## 1. Environment variables
Make a copy of `.env.local` if you haven't already. You must provide actual values to use all features:
- **MongoDB**: Create a free cluster on MongoDB Atlas and paste your connection string inside `MONGODB_URI`.
- **Google OAuth**: Go to Google Cloud Console > Credentials. Create an OAuth 2.0 Client ID for a Web Application. Put the client ID and secret in `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Setup the Authorized redirect URI as `https://your-domain.com/api/auth/callback/google`.
- **NextAuth Secret**: Run `openssl rand -base64 32` in a terminal or generate a random secret to place in `NEXTAUTH_SECRET`.
- **Cloudinary**: Create a free Cloudinary account for hosting images. Place your cloud name, API key, and API secret in the variables.
- **Nodemailer SMTP**: Using Gmail? You must enable 2-Step Verification on your Gmail account and then generate an "App Password". Use this App Password in `SMTP_PASS` and your email in `SMTP_USER`.

## 2. Running Locally
1. Run `npm install`
2. Ensure you have your `.env.local` fully configured.
3. Run `npm run dev` to start the development server on `http://localhost:3000`.

## 3. Initial Admin Setup
Since the first signed-in users are given the `user` role automatically by NextAuth, you will need to manually grant yourself `admin` access the very first time.
1. Sign in via Google or register an account.
2. Connect to your database using MongoDB Compass or Atlas UI.
3. Find your user document in the `users` collection.
4. Change the `role` field from `"user"` to `"admin"`.
5. Sign out and sign back in. You will now see the Admin Dashboard button in the Navbar.

## 4. Deployment

### Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Log in to Vercel and Import the project.
3. Map the Environment Variables from your `.env.local` into Vercel's Environment Variables settings.
4. Click Deploy! Next.js and Vercel will automatically build and host the application.

### Hostinger (cPanel / Hostinger API Node.js Deployment)
Hostinger supports Next.js via their Node.js application feature in the Game Panel or hPanel. Follow these steps for a complete deployment:

**Step 1: Build the Application Locally**
1. Ensure your `.env.local` contains production database & API keys.
2. In your terminal, run `npm run build`. This generates the `.next` production folder.
3. Once completed, create a ZIP file of all your project contents, **EXCLUDING** the `node_modules` folder (but **INCLUDE** the `.next` folder, `package.json`, and `.env.local`).

**Step 2: Upload to Hostinger File Manager**
1. Log in to your Hostinger hPanel and navigate to **File Manager**.
2. Go to `public_html` (or the folder for your domain).
3. Upload and extract your ZIP file here.

**Step 3: Setup Node.js in Hostinger**
1. In hPanel, scroll down to the **Advanced** section and select **Node.js**.
2. Fill out the application details:
   - **Application Root**: e.g. `/public_html`
   - **Application Startup File**: `node_modules/next/dist/bin/next`
   - **Application URL**: Select your domain URL.
3. Click "Create" or "Install".
4. Once the app is created, you will see an option to "Install NPM packages" or "Run npm install". Click it to install your dependencies (this generates the `node_modules` folder on the server).
5. Open the Node.js app environment variables settings and manually paste all limits from your `.env.local` (e.g. `MONGODB_URI`, `NEXTAUTH_SECRET`).

**Step 4: Launch the App**
1. Wait for `npm install` to finish successfully.
2. In the Next.js app on Hostinger hPanel, click **Restart** or **Start**.
3. Open your domain! Next.js will now be serving your marketplace.

### Alternative: Hostinger VPS (Ubuntu)
1. SSH into your VPS. Install Node.js (v18+) and PM2 (`npm install -g pm2`).
2. Clone your GitHub repository or upload your files via SFTP.
3. Run `npm install` inside the project folder.
4. Create `.env.local` with `nano .env.local` and paste your environment variables.
5. Build the project: `npm run build`.
6. Start the server via PM2: `pm2 start npm --name "nanded-marketplace" -- run start`.
7. Setup an NGINX reverse-proxy to point traffic from port 80 to port 3000.
