import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { Group } from '../types';

/**
 * Get all groups for a user from the split-trip collection
 */
export const getGroups = async (userId: string): Promise<Group[]> => {
    const groupsRef = collection(db, 'split-trip');
    const q = query(groupsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Group));
};

/**
 * Save or update a group for a user in the split-trip collection
 */
export const saveGroup = async (userId: string, group: Group): Promise<void> => {
    const groupRef = doc(db, 'split-trip', group.id);
    await setDoc(groupRef, { ...group, userId });
};

/**
 * Delete a group for a user from the split-trip collection
 */
export const deleteGroup = async (userId: string, groupId: string): Promise<void> => {
    const groupRef = doc(db, 'split-trip', groupId);
    await deleteDoc(groupRef);
};

/**
 * Subscribe to real-time updates for all groups in the split-trip collection
 */
export const subscribeToGroups = (
    userId: string,
    callback: (groups: Group[]) => void
): Unsubscribe => {
    const groupsRef = collection(db, 'split-trip');
    const q = query(groupsRef, where('userId', '==', userId));

    return onSnapshot(q, (snapshot) => {
        const groups = snapshot.docs.map(doc => {
            const data = doc.data();
            // Remove userId from the returned group object (it's only for querying)
            const { userId, ...groupData } = data;
            return { ...groupData, id: doc.id } as Group;
        });
        callback(groups);
    });
};

/**
 * Save the selected group ID for a user in a separate user-settings collection
 */
export const saveSelectedGroupId = async (userId: string, groupId: string): Promise<void> => {
    const userRef = doc(db, 'user-settings', userId);
    await setDoc(userRef, { selectedGroupId: groupId }, { merge: true });
};

/**
 * Get the selected group ID for a user from user-settings collection
 */
export const getSelectedGroupId = async (userId: string): Promise<string | null> => {
    const userRef = doc(db, 'user-settings', userId);
    const snapshot = await getDocs(collection(db, 'user-settings'));
    const userDoc = snapshot.docs.find(d => d.id === userId);
    return userDoc?.data()?.selectedGroupId ?? null;
};
