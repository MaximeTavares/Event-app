import { compare, hash } from './password.util';

describe('password.util', () => {
    describe('hash', () => {
        it('should return a string', async () => {
            const result = await hash('mySecurePassword');
            expect(typeof result).toBe('string');
        });

        it('two hashs should be differents', async () => {
            const result1 = await hash('mySecurePassword');
            const result2 = await hash('mySecurePassword');
            expect(result1).not.toBe(result2);
        });
    });

    describe('compare', () => {
        it('shoud return true when password match', async () => {
            const password = await hash('mySecurePassword');
            const passwordToTest = 'mySecurePassword';

            const result = await compare(passwordToTest, password);

            expect(result).toBe(true);
        });

        it('shoud return false when password mismatch', async () => {
            const password = await hash('mySecurePassword');
            const passwordToTest = 'WrongPassword';

            const result = await compare(passwordToTest, password);

            expect(result).toBe(false);
        });
    });
});
