import { db } from "../firebase.server";
import type { Group, Expense } from "../types";

const GROUPS_COL = "groups";

export const TripService = {
    async getGroups(uid: string): Promise<Group[]> {
        // For simplicity, we assume users can see groups they are members of.
        // However, since group members are just strings (names) in the current model, not UIDs,
        // we might need a mapping or just fetch all groups user created.
        // For this iteration, let's fetch groups where the 'ownerId' matches or something similar.
        // Given the simple model 'members: string[]', implementing robust query is hard without changing model.
        // Let's assume we store 'ownerId' or list of 'memberUids' in Group.
        // I'll update the Group type locally here or assume 'ownerId' is present for querying.

        // Let's query by a new field 'ownerId' which we will add when creating groups.
        const snapshot = await db.collection(GROUPS_COL).where("ownerId", "==", uid).get();
        const groups: Group[] = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();
            // Fetch subcollection expenses
            const expensesSnap = await doc.ref.collection("expenses").orderBy("createdAt", "desc").get();
            const expenses = expensesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Expense));

            groups.push({
                id: doc.id,
                name: data.name,
                members: data.members,
                expenses,
                // ...data
            });
        }
        return groups;
    },

    async createGroup(uid: string, name: string, members: string[]): Promise<Group> {
        const docRef = db.collection(GROUPS_COL).doc();
        const groupData = {
            name,
            members,
            ownerId: uid,
            createdAt: new Date(),
        };
        await docRef.set(groupData);
        return {
            id: docRef.id,
            name,
            members,
            expenses: []
        }
    },

    async deleteGroup(uid: string, groupId: string) {
        // Check ownership
        const docRef = db.collection(GROUPS_COL).doc(groupId);
        const doc = await docRef.get();
        if (!doc.exists || doc.data()?.ownerId !== uid) {
            throw new Error("Not authorized or group not found");
        }
        // Recursive delete is hard in firestore without cloud functions, but we can delete doc
        // Expenses will be orphaned but let's just delete the group doc for now.
        await db.recursiveDelete(docRef);
    },

    async addExpense(uid: string, groupId: string, expense: Omit<Expense, "id">): Promise<Expense> {
        // Verify group access
        const groupRef = db.collection(GROUPS_COL).doc(groupId);
        const groupSnap = await groupRef.get();
        if (!groupSnap.exists || groupSnap.data()?.ownerId !== uid) {
            throw new Error("Not authorized or group not found");
        }

        const expenseRef = groupRef.collection("expenses").doc();
        const newExpense = {
            ...expense,
            createdAt: new Date()
        };
        await expenseRef.set(newExpense);

        return {
            id: expenseRef.id,
            ...expense
        };
    }
};
