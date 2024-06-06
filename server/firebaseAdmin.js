const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const { ref, uploadBytes, getDownloadURL } = require('firebase-admin/storage');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines with actual newlines
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
const db = admin.firestore();

const uploadFileToFirebase = async (file) => {
  if (!file || !file.mimetype.startsWith('image/')) {
      throw new Error('Invalid file format. Please upload an image file.');
  }

  const storageRef = ref(bucket, `images/${Date.now()}-${file.originalname}`);
  const localFilePath = path.join(__dirname, 'uploads', file.name);

  // Save the file locally
  await file.mv(localFilePath);

  // Upload the local file to Firebase Storage
  const snapshot = await uploadBytes(storageRef, fs.readFileSync(localFilePath));

  // Delete the local file after uploading
  fs.unlinkSync(localFilePath);

  return getDownloadURL(snapshot.ref);
};

module.exports = { uploadFileToFirebase, db };
