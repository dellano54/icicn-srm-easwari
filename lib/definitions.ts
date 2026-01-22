import { z } from 'zod';

export const MemberSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number required"),
    college: z.string().min(2, "College name required"),
    department: z.string().min(2, "Department required"),
    city: z.string().min(2, "City required"),
    state: z.string().min(2, "State required"),
    country: z.string().min(2, "Country required"),
});

export const RegistrationSchema = z.object({
    teamName: z.string().min(3, "Team name is required"),
    domains: z.array(z.string()).min(1, "Select at least one domain").max(1, "Select only one domain"),
    members: z.array(MemberSchema).min(1).max(7),
});

export type RegistrationFormState = {
    errors?: {
        teamName?: string[];
        domains?: string[];
        paper?: string[];
        plagiarism?: string[];
        _form?: string[];
    };
    message?: string;
    success?: boolean;
    teamId?: string; // On success
    teamEmail?: string; // On success
};

export type AuthFormState = {
    message?: string;
};
