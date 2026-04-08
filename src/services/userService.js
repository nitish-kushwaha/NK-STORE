import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getAllUsers() {
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('getAllUsers error:', err.message);
    return [];
  }
}
