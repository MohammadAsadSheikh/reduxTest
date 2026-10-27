import usersReducer, { fetchUsers } from '../usersSlice';

describe('usersSlice', () => {
  const initialState = {
    data: [],
    status: 'idle',
    error: null,
  };

  it('should return the initial state', () => {
    expect(usersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle the pending state', () => {
    expect(
      usersReducer(initialState, {
        type: fetchUsers.pending.type,
      }),
    ).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should handle successful API responses', () => {
    const users = [{ id: 1, name: 'Demo User' }];

    expect(
      usersReducer(initialState, {
        type: fetchUsers.fulfilled.type,
        payload: users,
      }),
    ).toEqual({
      data: users,
      status: 'succeeded',
      error: null,
    });
  });

  it('should handle API failures', () => {
    expect(
      usersReducer(initialState, {
        type: fetchUsers.rejected.type,
        payload: 'Network error',
      }),
    ).toEqual({
      data: [],
      status: 'failed',
      error: 'Network error',
    });
  });
});
