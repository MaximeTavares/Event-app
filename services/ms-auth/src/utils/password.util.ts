import * as argon2 from 'argon2';

export async function hash(password: string): Promise<string> {
    const hashedPwd = await argon2.hash(password);
    return hashedPwd;
}

export async function compare(
    password: string,
    hashedPassword: string,
): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
}
