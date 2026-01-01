import type { Actions, PageServerLoad } from "./$types";
import { createSupabaseClient } from "$lib/supabase";
import { TripService } from "$lib/services/tripService";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase, getUser } }) => {
    try {
        console.log("Load: Checking auth...");
        const user = await getUser();

        if (user) {
            console.log("Load: User authenticated, fetching from DB");
            const { data: groups, error: groupsError } = await supabase
                .from('groups')
                .select(`
                    id,
                    name,
                    members,
                    expenses (*)
                `)
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (groupsError) throw groupsError;

            const formattedGroups = groups.map((g: any) => ({
                id: g.id,
                name: g.name,
                members: g.members,
                expenses: (g.expenses || []).map((e: any) => ({
                    id: e.id,
                    description: e.description,
                    amount: e.amount,
                    currency: e.currency,
                    type: e.type || 'expense',
                    paidBy: e.paid_by,
                    splitAmong: e.split_among,
                    exchangeRate: e.exchange_rate,
                    created_at: e.created_at
                })).sort((a: any, b: any) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
            }));

            return {
                groups: formattedGroups,
                source: "db",
                user: { uid: user.id, email: user.email }
            };
        }

        console.log("Load: User not authenticated (or validation failed), using local source");
        return {
            groups: [],
            source: "local"
        };
    } catch (e: any) {
        console.error("Load Error:", e);
        return {
            groups: [],
            source: "local",
            error: e.message || "Internal Server Error"
        };
    }
};

export const actions: Actions = {
    createGroup: async ({ request, locals: { supabase, getUser } }) => {
        const user = await getUser();
        if (!user) return fail(401, { error: "Unauthorized" });

        const formData = await request.formData();
        const name = formData.get("name")?.toString();
        const membersRaw = formData.get("members")?.toString() || "";
        const members = membersRaw.split(',').map(m => m.trim()).filter(Boolean);

        if (!name) return fail(400, { error: "Name required" });

        try {
            const { data: group, error } = await supabase
                .from('groups')
                .insert({
                    name,
                    members,
                    owner_id: user.id
                })
                .select()
                .single();

            if (error) throw error;

            return { success: true, group: {
                id: group.id,
                name: group.name,
                members: group.members,
                expenses: []
            } };
        } catch (e) {
            console.error(e);
            return fail(500, { error: "Failed to create group" });
        }
    },

    deleteGroup: async ({ request, locals: { supabase, getUser } }) => {
        const user = await getUser();
        if (!user) return fail(401, { error: "Unauthorized" });

        const formData = await request.formData();
        const groupId = formData.get("groupId")?.toString();

        if (!groupId) return fail(400, { error: "Group ID required" });

        try {
            const { error } = await supabase
                .from('groups')
                .delete()
                .eq('id', groupId)
                .eq('owner_id', user.id);

            if (error) throw error;
            return { success: true };
        } catch (e) {
            return fail(500, { error: "Failed to delete group " });
        }
    },

    addExpense: async ({ request, locals: { supabase, getUser } }) => {
        const user = await getUser();
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

            // Verify ownership
            const { data: group, error: groupError } = await supabase
                .from('groups')
                .select('owner_id')
                .eq('id', groupId)
                .single();
            
            if (groupError || group.owner_id !== user.id) {
                throw new Error("Not authorized or group not found");
            }

            const { data, error } = await supabase
                .from('expenses')
                .insert({
                    group_id: groupId,
                    description: expense.description,
                    amount: expense.amount,
                    currency: expense.currency,
                    type: expense.type,
                    paid_by: expense.paidBy,
                    split_among: expense.splitAmong,
                    exchange_rate: expense.exchangeRate
                })
                .select()
                .single();

            if (error) throw error;

            return { success: true };
        } catch (e) {
            console.error("AddExpense Error:", e);
            return fail(500, { error: "Failed to add expense" });
        }
    }
};
