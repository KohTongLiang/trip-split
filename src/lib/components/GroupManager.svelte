<script lang="ts">
    import type { Group } from "$lib/types";

    export let groups: Group[];
    export let selectedGroupId: string;

    // Callback props
    export let onSelect: (groupId: string) => void;
    export let onCreate: (name: string, members: string[]) => void;
    export let onUpdate: (group: Group) => void;
    export let onDelete: (groupId: string) => void;
    export let source: "db" | "local" = "local";

    let newName = "";
    let newMembersText = "";
    let addMemberName = "";

    $: selected = groups.find((g) => g.id === selectedGroupId);

    const handleCreate = () => {
        const name = newName.trim() || `Group ${groups.length + 1}`;
        const members = Array.from(
            new Set(
                newMembersText
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            ),
        );
        onCreate(name, members);
        newName = "";
        newMembersText = "";
    };

    const removeMemberFromSelected = (name: string) => {
        if (!selected) return;
        const members = selected.members.filter((m) => m !== name);
        const fixedExpenses = selected.expenses.map((e) => {
            const split = (e.splitAmong || []).filter((n) =>
                members.includes(n),
            );
            const splitAmong = split.length > 0 ? split : members;
            const paidBy = members.includes(e.paidBy)
                ? e.paidBy
                : (members[0] ?? e.paidBy);
            return { ...e, splitAmong, paidBy };
        });
        onUpdate({ ...selected, members, expenses: fixedExpenses });
    };

    const addMemberToSelected = (name: string) => {
        const trimmed = name.trim();
        if (!selected || !trimmed) return;
        if (selected.members.includes(trimmed)) return;
        const members = [...selected.members, trimmed];
        onUpdate({ ...selected, members });
    };

    const renameSelected = () => {
        if (!selected) return;
        const name = prompt("Rename group", selected.name) ?? selected.name;
        onUpdate({ ...selected, name });
    };

    const deleteSelected = () => {
        if (!selected) return;
        if (
            confirm(`Delete group "${selected.name}"? This cannot be undone.`)
        ) {
            onDelete(selected.id);
        }
    };

    // Icons
    const PlusIcon = `M12 4.5v15m7.5-7.5h-15`;
    const TrashIcon = `M6 7.5h12M9.75 7.5V6a2.25 2.25 0 012.25-2.25h0a2.25 2.25 0 012.25 2.25v1.5M18 7.5v12A2.25 2.25 0 0115.75 22h-7.5A2.25 2.25 0 016 19.5v-12m3 4.5v6m6-6v6`;
    const PencilIcon = `M16.862 4.487l1.651-1.651a2.121 2.121 0 113 3L9 19.5 4.5 21l1.5-4.5 10.862-12.013z`;
</script>

<div class="bg-white p-6 rounded-xl shadow-md">
    <h3 class="text-lg font-semibold text-slate-700 mb-4">Groups</h3>

    <div class="space-y-2 mb-6">
        {#each groups as g (g.id)}
            {#if source === "db"}
                <a
                    href={`/groups/${g.id}`}
                    class={`block w-full text-left px-3 py-2 rounded border hover:bg-sky-50 ${g.id === selectedGroupId ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200"}`}
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium text-slate-800">{g.name}</p>
                            <p class="text-xs text-slate-500">
                                {(g.members || []).join(", ")}
                            </p>
                        </div>
                    </div>
                </a>
            {:else}
                <button
                    on:click={() => onSelect(g.id)}
                    class={`w-full text-left px-3 py-2 rounded border hover:bg-sky-50 ${g.id === selectedGroupId ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200"}`}
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium text-slate-800">{g.name}</p>
                            <p class="text-xs text-slate-500">
                                {(g.members || []).join(", ")}
                            </p>
                        </div>
                    </div>
                </button>
            {/if}
        {/each}
    </div>

    {#if selected}
        <div class="mb-6 border-t pt-4">
            <div class="flex items-center justify-between mb-2">
                <p class="font-semibold text-slate-700">
                    Selected: {selected.name}
                </p>
                <div class="flex items-center gap-2">
                    <button
                        on:click={renameSelected}
                        class="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded inline-flex items-center gap-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="h-4 w-4"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d={PencilIcon}
                            />
                        </svg>
                        Rename
                    </button>
                    <button
                        on:click={deleteSelected}
                        class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded inline-flex items-center gap-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="h-4 w-4"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d={TrashIcon}
                            />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>

            <p class="text-sm text-slate-600 mb-1">Members</p>
            <div class="flex flex-wrap items-center gap-2 mb-3">
                {#each selected.members || [] as name}
                    <span
                        class="inline-flex items-center gap-2 px-2 py-1 rounded border border-slate-300 bg-slate-50"
                    >
                        <span>{name}</span>
                        <button
                            on:click={() => removeMemberFromSelected(name)}
                            class="text-xs text-red-600 hover:underline"
                            >Remove</button
                        >
                    </span>
                {/each}
            </div>
            <div class="flex gap-2">
                <input
                    type="text"
                    placeholder="Add member name"
                    class="flex-1 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
                    bind:value={addMemberName}
                    on:keydown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addMemberToSelected(addMemberName);
                            addMemberName = "";
                        }
                    }}
                />
                <button
                    on:click={() => {
                        addMemberToSelected(addMemberName);
                        addMemberName = "";
                    }}
                    class="px-3 py-2 text-sm rounded bg-slate-100 hover:bg-slate-200"
                    >Add</button
                >
            </div>
        </div>
    {/if}

    <div class="border-t pt-4">
        <p class="font-semibold text-slate-700 mb-2">Create new group</p>
        <input
            type="text"
            bind:value={newName}
            placeholder="Group name"
            class="w-full mb-3 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
        />
        <p class="text-sm text-slate-600 mb-1">Members (comma separated)</p>
        <input
            type="text"
            bind:value={newMembersText}
            placeholder="e.g. Alice, Bob, Charlie"
            class="w-full mb-3 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring focus:ring-sky-200"
        />
        <button
            on:click={handleCreate}
            class="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={PlusIcon}
                />
            </svg>
            Create Group
        </button>
    </div>
</div>
