# MFA Project

A simple Node.js project that implements user authentication with Multi-Factor Authentication (MFA) using TOTP (Time-based One-Time Password). This project includes user registration, login, MFA setup, verification, and reset functionalities.

## Features

- **User Registration**: Create a new user account with username and password.
- **User Login**: Authenticate users with their username and password.
- **User Logout**: Log out the user.
- **2FA Setup**: Set up 2FA using TOTP (Time-based One-Time Password).
- **2FA Verification**: Verify the 2FA code during login.
- **2FA Reset**: Reset the 2FA setup for a user.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side.
- **Nodemon**: To restart on save
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user data.
- **Passport.js**: Authentication middleware for Node.js.
- **Speakeasy**: Library for generating and verifying TOTP.
- **QRCode**: Library for generating QR codes for 2FA setup.
- **bcryptjs**: For hashing user passwords.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- MongoDB (local or cloud-based)

### Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/MFA-project.git
   cd MFA-project
   ```
2. Install the dependencies:
   npm install

3. Create a .env file in the root of your project and add the following:
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development

4. Start the server:
   npm run dev
