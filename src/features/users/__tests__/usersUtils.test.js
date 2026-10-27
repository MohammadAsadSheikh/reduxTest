import { filterUsers, sortUsers } from '../usersUtils';

const users = [
  {
    id: 1,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    company: { name: 'Acme Inc' },
  },
  {
    id: 2,
    name: 'Alice Smith',
    email: 'alice@example.com',
    company: { name: 'Bright Labs' },
  },
  {
    id: 3,
    name: 'Bob Jones',
    email: 'bob@example.com',
    company: { name: 'Acme Inc' },
  },
];

describe('filterUsers', () => {
  it('returns all users for an empty query', () => {
    expect(filterUsers(users, '')).toEqual(users);
  });

  it('searches names without case sensitivity', () => {
    expect(filterUsers(users, 'ALICE')).toEqual([users[1]]);
  });

  it('searches email addresses', () => {
    expect(filterUsers(users, 'bob@example')).toEqual([users[2]]);
  });

  it('searches company names', () => {
    expect(filterUsers(users, 'acme')).toEqual([users[0], users[2]]);
  });

  it('trims whitespace from the query', () => {
    expect(filterUsers(users, '  Alice  ')).toEqual([users[1]]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterUsers(users, 'nonexistent')).toEqual([]);
  });

  it('handles users with missing optional fields', () => {
    const incompleteUsers = [{ id: 4, name: 'Dana' }];

    expect(filterUsers(incompleteUsers, 'dana')).toEqual(incompleteUsers);
    expect(filterUsers(incompleteUsers, 'company')).toEqual([]);
  });
});

describe('sortUsers', () => {
  it('sorts names in ascending order by default', () => {
    expect(sortUsers(users).map(user => user.name)).toEqual([
      'Alice Smith',
      'Bob Jones',
      'Charlie Brown',
    ]);
  });

  it('sorts names in descending order', () => {
    expect(sortUsers(users, 'name-desc').map(user => user.name)).toEqual([
      'Charlie Brown',
      'Bob Jones',
      'Alice Smith',
    ]);
  });

  it('does not mutate the original array', () => {
    const originalOrder = users.map(user => user.id);

    sortUsers(users);

    expect(users.map(user => user.id)).toEqual(originalOrder);
  });

  it('handles missing names', () => {
    const incompleteUsers = [
      { id: 1, name: 'Zoe' },
      { id: 2 },
      { id: 3, name: 'Alex' },
    ];

    expect(sortUsers(incompleteUsers).map(user => user.name || '')).toEqual([
      '',
      'Alex',
      'Zoe',
    ]);
  });
});
