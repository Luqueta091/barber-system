import { shouldBlockClient } from '@/modules/clientes/domain/rules/RegraDeBloqueioPorFaltas';

describe('RegraDeBloqueioPorFaltas', () => {
  it('não bloqueia quando faltas < limite', () => {
    expect(shouldBlockClient(1, 3)).toBe(false);
  });

  it('bloqueia quando faltas >= limite', () => {
    expect(shouldBlockClient(3, 3)).toBe(true);
    expect(shouldBlockClient(4, 3)).toBe(true);
  });
});
