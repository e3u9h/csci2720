# CSCI2720 Course Project

This is the course project of **CSCI2720**. We use the following technologies:

- **Vite.js** for the frontend
- **Express.js** for the backend
- **MongoDB** for the database

We also use the **Google Maps API** in this project.

---

## Setting Up the Project

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
node utils/parseXML.js
```
Start the backend server:
```bash
npm start
```