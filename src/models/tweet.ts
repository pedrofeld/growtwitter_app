/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from "./user";

export interface Tweet {
    id: string;
    user: User;
    content: string;
    createdAt: Date;
    likes: any[];
    replies: number;
}