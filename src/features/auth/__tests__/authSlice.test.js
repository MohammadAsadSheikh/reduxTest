import authReducer, { loginSuccess, logout } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should authenticate a user after login', () => {
    const user = {
      id: '1',
      name: 'Demo User',
    };

    expect(authReducer(initialState, loginSuccess(user))).toEqual({
      user,
      isAuthenticated: true,
    });
  });

  it('should clear the user after logout', () => {
    const loggedInState = {
      user: { id: '1', name: 'Demo User' },
      isAuthenticated: true,
    };

    expect(authReducer(loggedInState, logout())).toEqual(initialState);
  });
});
