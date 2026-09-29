import { describe, it, expect, vi, beforeEach } from '@jest/globals';
import { BookingOrchestrationService } from '../../src/services/bookingOrchestrationService';

jest.mock('../../src/db/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        id: 'booking-1',
        amountCents: 50000,
        flight: { id: 'flight-1', airlineCode: 'DL' },
      }),
    }),
  },
}));

jest.mock('../../src/services/inflightServicesService', () => ({
  inflightServicesService: {
    getBookingServices: jest.fn().mockResolvedValue([
      { serviceId: 'meal-1', name: 'Vegetarian Meal', type: 'meal', price: 1500, quantity: 1 },
    ]),
    calculateServicePricing: jest.fn().mockReturnValue({
      totalCents: 1500,
      currency: 'USD',
      breakdown: [{ description: 'Vegetarian Meal', amountCents: 1500 }],
    }),
  },
}));

describe('BookingOrchestrationService - Services Integration', () => {
  let service: BookingOrchestrationService;

  beforeEach(() => {
    service = new BookingOrchestrationService();
  });

  it('should calculate booking total including ancillary services', async () => {
    const total = await service.calculateBookingTotalWithServices('booking-1');
    expect(total.baseFareCents).toBe(50000);
    expect(total.servicesCents).toBe(1500);
    expect(total.totalCents).toBe(51500);
    expect(total.currency).toBe('USD');
  });
});
