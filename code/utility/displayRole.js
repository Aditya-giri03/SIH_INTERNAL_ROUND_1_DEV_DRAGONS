function getRole(role) {
  if (role == 'user') return 'Department Head';
  if (role == 'admin') return 'Administrator';
  if (role == 'officer') return 'Finance Officer';
  else return 'Not Verified';
}

export { getRole };
