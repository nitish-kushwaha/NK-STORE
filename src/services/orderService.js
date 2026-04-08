import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export async function placeOrder(userId, items, total, shippingAddress) {
  return addDoc(collection(db, 'orders'), {
    userId,
    items,
    total,
    shippingAddress,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function getUserOrders(userId) {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getUserOrders error', err);
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  return updateDoc(doc(db, 'orders', orderId), { status });
}
