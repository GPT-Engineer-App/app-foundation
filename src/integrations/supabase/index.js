import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### chat_messages

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | uuid        | string | true     |
| thread_id  | text        | string | true     |
| user_id    | uuid        | string | false    |
| message    | text        | string | true     |
| created_at | timestamptz | string | false    |

### tasks

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | uuid        | string | true     |
| content    | text        | string | true     |
| status     | text        | string | false    |
| created_at | timestamptz | string | false    |

### profiles

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | uuid        | string | true     |
| updated_at | timestamptz | string | false    |
| username   | text        | string | false    |
| full_name  | text        | string | false    |
| avatar_url | text        | string | false    |
| website    | text        | string | false    |

### animals

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | bigint      | number | true     |
| created_at | timestamptz | string | true     |
| name       | text        | string | false    |
| species    | text        | string | false    |
| image_url  | text        | string | false    |

*/

// Hooks for chat_messages
export const useChatMessages = (thread_id) => useQuery({
    queryKey: ['chat_messages', thread_id],
    queryFn: () => fromSupabase(supabase.from('chat_messages').select('*').eq('thread_id', thread_id)),
});

export const useAddChatMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newMessage) => fromSupabase(supabase.from('chat_messages').insert([newMessage])),
        onSuccess: () => {
            queryClient.invalidateQueries('chat_messages');
        },
    });
};

// Hooks for tasks
export const useTasks = () => useQuery({
    queryKey: ['tasks'],
    queryFn: () => fromSupabase(supabase.from('tasks').select('*')),
});

export const useAddTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTask) => fromSupabase(supabase.from('tasks').insert([newTask])),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedTask) => fromSupabase(supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('tasks').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

// Hooks for profiles
export const useProfile = (id) => useQuery({
    queryKey: ['profiles', id],
    queryFn: () => fromSupabase(supabase.from('profiles').select('*').eq('id', id).single()),
});

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedProfile) => fromSupabase(supabase.from('profiles').update(updatedProfile).eq('id', updatedProfile.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

// Hooks for animals
export const useAnimals = () => useQuery({
    queryKey: ['animals'],
    queryFn: () => fromSupabase(supabase.from('animals').select('*')),
});

export const useAddAnimal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newAnimal) => fromSupabase(supabase.from('animals').insert([newAnimal])),
        onSuccess: () => {
            queryClient.invalidateQueries('animals');
        },
    });
};

export const useUpdateAnimal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedAnimal) => fromSupabase(supabase.from('animals').update(updatedAnimal).eq('id', updatedAnimal.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('animals');
        },
    });
};

export const useDeleteAnimal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('animals').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('animals');
        },
    });
};