import { supabase } from "../supabase";
import type { Group, Expense } from "../types";

export const TripService = {
    async getGroups(uid: string): Promise<Group[]> {
        const { data: groupsData, error: groupsError } = await supabase
            .from('groups')
            .select(`
                id,
                name,
                members,
                expenses (*)
            `)
            .eq('owner_id', uid)
            .order('created_at', { ascending: false });

        if (groupsError) throw groupsError;

        return groupsData.map(g => ({
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
                exchangeRate: e.exchange_rate
            })).sort((a: any, b: any) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
        }));
    },

    async createGroup(uid: string, name: string, members: string[]): Promise<Group> {
        const { data, error } = await supabase
            .from('groups')
            .insert({
                name,
                members,
                owner_id: uid
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            members: data.members,
            expenses: []
        };
    },

    async deleteGroup(uid: string, groupId: string) {
        const { error } = await supabase
            .from('groups')
            .delete()
            .eq('id', groupId)
            .eq('owner_id', uid);

        if (error) throw error;
    },

    async addExpense(uid: string, groupId: string, expense: Omit<Expense, "id">): Promise<Expense> {
        // First verify ownership of the group
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('owner_id')
            .eq('id', groupId)
            .single();
        
        if (groupError || group.owner_id !== uid) {
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

        return {
            id: data.id,
            description: data.description,
            amount: data.amount,
            currency: data.currency,
            type: data.type,
            paidBy: data.paid_by,
            splitAmong: data.split_among,
            exchangeRate: data.exchange_rate
        };
    }
};
