import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals: { supabase, getUser } }) => {
    const user = await getUser();
    if (!user) {
        return {
            group: null,
            user: null
        }
    }

    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select(`
            id,
            name,
            members,
            expenses (*)
        `)
        .eq('id', params.id)
        .eq('owner_id', user.id)
        .single();

    if (groupError || !group) {
        throw error(404, "Group not found");
    }

    const formattedGroup = {
        id: group.id,
        name: group.name,
        members: group.members,
        expenses: (group.expenses || []).map((e: any) => ({
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
    };

    return {
        group: formattedGroup,
        user: { uid: user.id, email: user.email }
    };
};
