export const selectUsers = state => state.users.data;

export const selectUsersStatus = state => state.users.status;

export const selectUsersError = state => state.users.error;

export const selectUserById = (state, userId) =>
  state.users.data.find(user => user.id === userId);
