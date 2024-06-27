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
| id         | int8        | number | true     |
| created_at | timestamptz | string | true     |
| name       | text        | string | false    |
| species    | text        | string | false    |
| image_url  | text        | string | false    |

### chat_messages

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| thread_id  | uuid        | string | true     |
| sender     | text        | string | true     |
| message    | text        | string | true     |
| created_at | timestamptz | string | true     |

*/

export const useProfile = (id) => useQuery({
    queryKey: ['profiles', id],
    queryFn: () => fromSupabase(supabase.from('profiles').select('*').eq('id', id).single()),
});

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (profile) => fromSupabase(supabase.from('profiles').update(profile).eq('id', profile.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

export const useAnimals = () => useQuery({
    queryKey: ['animals'],
    queryFn: () => fromSupabase(supabase.from('animals').select('*')),
});

export const useUpdateAnimal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (animal) => fromSupabase(supabase.from('animals').update(animal).eq('id', animal.id)),
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

export const useAddAnimal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (animal) => fromSupabase(supabase.from('animals').insert(animal)),
        onSuccess: () => {
            queryClient.invalidateQueries('animals');
        },
    });
};

export const useChatMessages = (threadId) => useQuery({
    queryKey: ['chat_messages', threadId],
    queryFn: () => fromSupabase(supabase.from('chat_messages').select('*').eq('thread_id', threadId).order('created_at', { ascending: true })),
});

export const useAddChatMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (message) => fromSupabase(supabase.from('chat_messages').insert(message)),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['chat_messages', variables.thread_id]);
        },
    });
};