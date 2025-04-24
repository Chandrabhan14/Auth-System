# Auth-System
Role-Based Auth System with React.js , Node.js , mySql

A full-stack authentication system built using **React**, **Node.js**, **Express**, and **MySQL**, featuring:
- Admin & Customer Registration
- Email Verification
- Login with Protected Routes
- Role-Based Dashboards

---

## 🚀 Features

- 🔐 Admin & Customer login with password hashing
- ✅ Email verification for secure signups
- 🛡️ Protected frontend routes using `React Router`
- 🧭 Navigation based on user role
- 💾 Persistent login state using `localStorage`
- ✨ Clean UI with basic CSS styling
- 🚀 - JWT auth used 


## 🔒 User Flow - 
Register as Admin or Customer.

Verify email using the code received (mocked or via backend console/email service).

Login using your credentials.

View welcome dashboard (Admin or Customer).

Routes are protected — you must be authenticated to view them.


## 🚀 Steps for starting frontend - 
📁 1. Clone and Navigate from project 
      ```bash
git clone https://github.com/chandrabhan14/Auth-system
cd frontend

  2. Install Node Modules - 
npm install


  3. Run frontend  - 
npm run dev 

## 🚀 Steps for starting Backend - 
📁 1. Navigate  folder -
cd backend 

  2. Install Node Modules - 
npm install

  3. Run frontend  - 
npm run dev 

## 🚀 For Local DB setup queries - 
//use this 
CREATE DATABASE auth_db;
USE auth_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('customer', 'admin'),
  isVerified BOOLEAN DEFAULT FALSE,
  verificationCode VARCHAR(255)
);



