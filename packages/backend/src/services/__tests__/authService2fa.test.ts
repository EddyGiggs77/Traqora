import { AuthService } from '../authService';
import { DataSource } from 'typeorm';

describe('AuthService 2FA', () => {
    let authService: AuthService;
    let mockDataSource: any;

    beforeEach(() => {
        mockDataSource = {
            getRepository: jest.fn().mockReturnValue({
                findOne: jest.fn(),
                save: jest.fn(),
                create: jest.fn(),
            }),
        };
        authService = new AuthService(mockDataSource, 'redis://localhost:6379');
        // Mock redis
        (authService as any).redis = {
            set: jest.fn().mockResolvedValue('OK'),
            get: jest.fn(),
            del: jest.fn().mockResolvedValue(1),
            quit: jest.fn().mockResolvedValue('OK'),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('setupTotp returns secret, qrCodeUrl and backup codes', async () => {
        const repo = mockDataSource.getRepository();
        repo.findOne.mockResolvedValueOnce({ walletAddress: 'G123456789' });

        const result = await authService.setupTotp('G123456789');
        expect(result.secret).toBeDefined();
        expect(result.qrCodeUrl).toBeDefined();
        expect(result.backupCodes).toHaveLength(8);
    });

    test('setupTotp throws error if user not found', async () => {
        const repo = mockDataSource.getRepository();
        repo.findOne.mockResolvedValueOnce(null);

        await expect(authService.setupTotp('G123456789')).rejects.toThrow('User not found');
    });

    test('adminSet2faEnforcement updates user enforcement', async () => {
        const repo = mockDataSource.getRepository();
        const user = { walletAddress: 'G123456789', is2faEnforced: false };
        repo.findOne.mockResolvedValueOnce(user);

        await authService.adminSet2faEnforcement('G123456789', true);
        expect(user.is2faEnforced).toBe(true);
        expect(repo.save).toHaveBeenCalledWith(user);
    });

    test('checkDeviceRemembered returns correct boolean', async () => {
        const redisMock = (authService as any).redis;
        redisMock.get.mockResolvedValueOnce('1');
        const remembered = await authService.checkDeviceRemembered('G123', 'token123');
        expect(remembered).toBe(true);

        redisMock.get.mockResolvedValueOnce(null);
        const notRemembered = await authService.checkDeviceRemembered('G123', 'token123');
        expect(notRemembered).toBe(false);
    });
});
