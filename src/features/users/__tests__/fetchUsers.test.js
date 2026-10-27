import { fetchUsers } from '../usersSlice';

describe('fetchUsers async thunk', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.fetch = originalFetch;
  });

  it('should return users when the API request succeeds', async () => {
    const mockUsers = [
      { id: 1, name: 'Leanne Graham' },
      { id: 2, name: 'Ervin Howell' },
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });

    const result = await fetchUsers()(jest.fn(), jest.fn(), undefined);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
    );

    expect(result.type).toBe('users/fetchUsers/fulfilled');
    expect(result.payload).toEqual(mockUsers);
  });

  it('should reject when the API returns an HTTP error', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
    });

    const result = await fetchUsers()(jest.fn(), jest.fn(), undefined);

    expect(result.type).toBe('users/fetchUsers/rejected');
    expect(result.payload).toBe('Failed to fetch users');
  });

  it('should reject when the network request fails', async () => {
    global.fetch.mockRejectedValue(new Error('Network unavailable'));

    const result = await fetchUsers()(jest.fn(), jest.fn(), undefined);

    expect(result.type).toBe('users/fetchUsers/rejected');
    expect(result.payload).toBe('Network unavailable');
  });
});
