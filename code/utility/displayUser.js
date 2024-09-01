// import { db } from '../firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';

// async function getUserById(userID) {
//   // Get the user document from Firestore
//   const userDoc = await getDoc(doc(db, 'users', userID));

//   // If the user document exists, return the user's name
//   if (userDoc.exists()) {
//     return userDoc.data();
//   }

//   // If the user document doesn't exist, return 'Unknown'
//   return null;
// }

// async function getUserByEmail(userName) {
//   // Get the user document from Firestore
//   const userRef = collection(db, 'users');
//   const q = query(userRef, where('email', '==', userName));
//   const invoices = await getDoc(q);
//   // const userDoc = await getDoc(doc(db, 'users', userID));

//   // If the user document exists, return the user's name
//   if (invoices.exists()) {
//     return invoices.data();
//   }

//   // If the user document doesn't exist, return 'Unknown'
//   return null;
// }

// export { getUserById, getUserByEmail };
