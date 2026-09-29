import { DisputeService } from '../disputeService';

describe('DisputeService Coverage', () => {
  let service: DisputeService;

  beforeEach(() => {
    service = new DisputeService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should select arbitrator deterministically', () => {
    const arb1 = (service as any).selectArbitrator('test-id-1');
    const arb2 = (service as any).selectArbitrator('test-id-1');
    expect(arb1).toBe(arb2);
  });
});
