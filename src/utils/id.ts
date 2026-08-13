import { customAlphabet } from 'nanoid';

export default function generateUniqueId(): string {
    const nanoId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ012345789');

    return nanoId(5); // Generate a unique ID with 5 characters
};