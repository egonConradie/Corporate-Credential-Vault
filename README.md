# 🛡️ Cool Tech Credential Vault

A secure, internal web application designed for **Cool Tech** to manage login credentials across various departments. Built using the **MERN Stack** (MongoDB, Express, React, Node.js), this application features robust authentication and Role-Based Access Control (RBAC).

## 🚀 Features

- **Secure Authentication:** User registration and login using JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC):**
  - **Normal Users:** View and add credentials.
  - **Management:** View, add, and update credentials.
  - **Admins:** Manage users (assign divisions, change roles) and credentials.
- **Organizational Structure:** Handles multiple Organisational Units (OUs) and Divisions.
- **Modern UI:** Clean, responsive interface built with React.

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** BCrypt (Password Hashing), JWT (Session Management)

## ⚙️ Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/YOUR_USERNAME/Corporate-Credential-Vault.git](https://github.com/YOUR_USERNAME/Corporate-Credential-Vault.git)
    cd Corporate-Credential-Vault
    ```

2.  **Install Dependencies**
    - **Server:**
      ```bash
      cd server
      npm install
      ```
    - **Client:**
      ```bash
      cd client
      npm install
      ```

3.  **Environment Setup**
    Create a `.env` file in the `server` folder with the following:

    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/cooltech_db
    JWT_SECRET=your_super_secret_key
    ```

4.  **Run the Application**
    - **Terminal 1 (Backend):** `cd server` then `npm run dev` (or `npx nodemon index.js`)
    - **Terminal 2 (Frontend):** `cd client` then `npm start`

5.  **Seed the Database (First Run Only)**
    To create the Admin user and Divisions, send a POST request to:
    `http://localhost:5000/api/seed`

## 🔑 Default Login

- **Username:** `admin`
- **Password:** `admin123`

---

_Capstone Project for HyperionDev Level 4_
