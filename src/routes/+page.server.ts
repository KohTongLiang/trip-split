import type { Actions, PageServerLoad } from "./$types";
import { app, db } from "$lib/firebase.server"; // Import auth from firebase-admin app? No, firebase-admin/auth
import { getAuth } from "firebase-admin/auth";
import { TripService } from "$lib/services/tripService";
import { fail } from "@sveltejs/kit";

// Helper to verify token
const verifyToken = async (cookies: any) => {
    const token = cookies.get("token");
    if (!token) {
        console.log("VerifyToken: No token cookie found");
        return null;
    }
    try {
        const decoded = await getAuth(app).verifyIdToken(token);
        console.log("VerifyToken: Token verified for uid", decoded.uid);
        return decoded;
    } catch (e) {
        console.error("VerifyToken: Validation failed", e);
        return null;
    }
};

export const load: PageServerLoad = async ({ cookies }) => {
    console.log("Load: Checking auth...");
    const user = await verifyToken(cookies);

    if (user) {
        console.log("Load: User authenticated, fetching from DB");
        const groups = await TripService.getGroups(user.uid);
        return {
            groups,
            source: "db",
            user: { uid: user.uid, email: user.email }
        };
    }

    console.log("Load: User not authenticated (or validation failed), using local source");
    return {
        groups: [],
        source: "local"
    };
};

export const actions: Actions = {
    createGroup: async ({ request, cookies }) => {
        const user = await verifyToken(cookies);
        if (!user) return fail(401, { error: "Unauthorized" });

        const formData = await request.formData();
        const name = formData.get("name")?.toString();

        // Members parsing is tricky from a simple form if it's a list. 
        // We'll assume the client sends a JSON string or we parse it differently.
        // For now let's assume 'members' is a JSON string or comma separated.
        const membersRaw = formData.get("members")?.toString() || "";
        const members = membersRaw.split(',').map(m => m.trim()).filter(Boolean);

        if (!name) return fail(400, { error: "Name required" });

        try {
            const group = await TripService.createGroup(user.uid, name, members);
            return { success: true, group };
        } catch (e) {
            console.error(e);
            return fail(500, { error: "Failed to create group" });
        }
    },

    deleteGroup: async ({ request, cookies }) => {
        const user = await verifyToken(cookies);
        if (!user) return fail(401, { error: "Unauthorized" });

        const formData = await request.formData();
        const groupId = formData.get("groupId")?.toString();

        if (!groupId) return fail(400, { error: "Group ID required" });

        try {
            await TripService.deleteGroup(user.uid, groupId);
            return { success: true };
        } catch (e) {
            return fail(500, { error: "Failed to delete group " });
        }
    },

    addExpense: async ({ request, cookies }) => {
        const user = await verifyToken(cookies);
        if (!user) {
            console.error("AddExpense: Unauthorized user");
            return fail(401, { error: "Unauthorized" });
        }

        const formData = await request.formData();
        const groupId = formData.get("groupId")?.toString();
        const expenseJson = formData.get("expense")?.toString();

        if (!groupId || !expenseJson) {
            console.error("AddExpense: Missing data", { groupId, expenseJson });
            return fail(400, { error: "Missing data" });
        }

        try {
            const expense = JSON.parse(expenseJson);
            // Ensure exchangeRate is passed safely
            // Validations should be here

            console.log(`AddExpense: Adding for User ${user.uid} to Group ${groupId}`);
            await TripService.addExpense(user.uid, groupId, expense);
            console.log("AddExpense: Success");
            return { success: true };
        } catch (e) {
            console.error("AddExpense Error:", e);
            return fail(500, { error: "Failed to add expense" });
        }
    }
};
