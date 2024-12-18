# CSCI2720 Course Project

This is the course project of **CSCI2720**. We use the following technologies:

We declare that the lab work here submitted is original except for source material explicitly acknowledged,
and that the same or closely related material has not been previously submitted for another course.
We also acknowledge that we am aware of University policy and regulations on honesty in academic work, and of the disciplinary
guidelines and procedures applicable to breaches of such policy and regulations, as contained in the website.
University Guideline on Academic Honesty:

https://www.cuhk.edu.hk/policy/academichonesty/

Student Name : DU Fangzhou
Student ID : 1155173892
Class/Section : CSCI2720

Student Name : DING Yuzhou
Student ID : 1155173825
Class/Section : CSCI2720

Student Name : WEI Youlin
Student ID : 1155157186
Class/Section : CSCI2720


Date : 18 Dec

- **React.js** for the frontend
- **Express.js** for the backend
- **MongoDB** for the database

We also use the **Google Maps API** in this project.

---

## Setting Up the Project

**For TA grading: Please skip the Prerequisites and Environment variables parts, because we have already included the `.env` files in our submitted ZIP file, which also contains the API key. The only prerequiisite for TAs is to have a local MongoDB.**

### Prerequisites

1. **Google Maps API Key**  
   To run this app, you need to create your own Google Maps API key.
   
2. **MongoDB Server**  
   You also need to set up your own MongoDB server.

---

### Environment Variables

- Add a `.env` file in the `csci2720` directory with the following content:

  ```env
  VITE_BACKEND_URL=YOUR_BACKEND_URL
  VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
  ```
- Add another .env file in the backend directory with the following content:
  ```env
  PORT=YOUR_BACKEND_PORT
  MONGODB_URI=YOUR_MONGODB_URI
  JWT_SECRET=YOUR_JWT_SECRET
  GOOGLE_MAPS_API_KEY=YOUR_API_KEY
  RANDOM_SEED=ARBITRARY_RANDOM_SEED
    ```
   - Note: The RANDOM_SEED is used for randomly selecting 10 locations from the location list.
 
**TA please start from here.**
### Running the Frontend
Navigate to the csci2720 directory:
```bash
cd csci2720
```
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
### Running the Backend
Navigate to the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Initialize the Database (only required on the first run):
Run the following command to save all events and locations from the XML files into the database and create an admin account:
```bash
node utils/parseXML_store10.js
```
Start the backend server:
```bash
npm start
```
