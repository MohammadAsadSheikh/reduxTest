export function filterUsers(users, searchQuery) {
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    return users;
  }

  return users.filter(user => {
    const searchableFields = [user.name, user.email, user.company?.name];

    return searchableFields.some(value =>
      (value || '').toLowerCase().includes(query),
    );
  });
}

export function sortUsers(users, sortOrder = 'name-asc') {
  const sortedUsers = [...users];

  sortedUsers.sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (nameA < nameB) {
      return sortOrder === 'name-desc' ? 1 : -1;
    }

    if (nameA > nameB) {
      return sortOrder === 'name-desc' ? -1 : 1;
    }

    return 0;
  });

  return sortedUsers;
}
