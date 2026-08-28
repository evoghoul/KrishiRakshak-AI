import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZGNrC7Om5PPZkMYN-6Et0JoWfBWLRWxA",
  authDomain: "krishirakshak-ai-4c3b9.firebaseapp.com",
  projectId: "krishirakshak-ai-4c3b9",
  storageBucket: "krishirakshak-ai-4c3b9.firebasestorage.app",
  messagingSenderId: "798643205202",
  appId: "1:798643205202:web:fd4e67eca7f83d9b8a5b8b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const masterAlerts = [
  {
    id: 'alert-1',
    targetCrop: 'Tomato',
    title: 'Leaf-curl virus risk',
    subtitle: 'Whitefly activity rising in nearby Tomato fields.',
    urgency: 'urgent',
    icon: 'Bug',
    treatment: 'Apply systemic insecticide immediately to control whitefly vector.',
    chemicals: 'Diafenthiuron 50% WP @ 1.25g/L.',
    preventive: 'Install yellow sticky traps.',
  },
  {
    id: 'alert-2',
    targetCrop: 'Paddy',
    title: 'Stem borer watch',
    subtitle: 'Check Paddy tillers for dead-heart symptoms.',
    urgency: 'warning',
    icon: 'Bug',
    treatment: 'Monitor ETL. Clip seedling tips before transplanting.',
    chemicals: 'Cartap Hydrochloride 4G @ 7.5 kg/acre.',
    preventive: 'Set up light traps and avoid excess nitrogen.',
  },
  {
    id: 'alert-3',
    targetCrop: 'ALL',
    title: 'Evening thunderstorm',
    subtitle: 'Delay pesticide spraying after 5 PM today.',
    urgency: 'info',
    icon: 'CloudLightning',
    treatment: 'Rainfall will wash away foliar applications. Postpone until tomorrow morning.',
    chemicals: 'Use a silicone-based non-ionic sticker if spraying becomes urgent tomorrow.',
    preventive: 'Ensure drainage channels are clear to prevent waterlogging around roots.',
  }
];

async function seed() {
  console.log("Seeding alerts to Firestore...");
  let successCount = 0;
  for (const alert of masterAlerts) {
    try {
      const { id, ...data } = alert;
      await setDoc(doc(collection(db, "alerts"), id), data);
      console.log(`Successfully added alert: ${id}`);
      successCount++;
    } catch (e) {
      console.error(`Error adding alert ${alert.id}:`, e);
    }
  }
  console.log(`Seeding complete. Added ${successCount}/${masterAlerts.length} alerts.`);
  process.exit(0);
}

seed();
