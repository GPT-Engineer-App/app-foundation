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

*/

// Hooks for profiles table
export const useProfiles = () => useQuery({
    queryKey: ['profiles'],
    queryFn: () => fromSupabase(supabase.from('profiles').select('*')),
});

export const useProfile = (id) => useQuery({
    queryKey: ['profiles', id],
    queryFn: () => fromSupabase(supabase.from('profiles').select('*').eq('id', id).single()),
});

export const useAddProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProfile) => fromSupabase(supabase.from('profiles').insert([newProfile])),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedProfile) => fromSupabase(supabase.from('profiles').update(updatedProfile).eq('id', updatedProfile.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

export const useDeleteProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('profiles').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

// Hooks for animals table
export const useAnimals = () => useQuery({
    queryKey: ['animals'],
    queryFn: () => fromSupabase(supabase.from('animals').select('*')),
});

export const useAnimal = (id) => useQuery({
    queryKey: ['animals', id],
    queryFn: () => fromSupabase(supabase.from('animals').select('*').eq('id', id).single()),
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