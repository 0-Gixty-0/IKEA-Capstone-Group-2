export const mapRolesToOptions = (roles: { label: string; value: string }[]) => {
    return roles.map(role => ({
      label: role.label,
      value: Number(role.value),
    }));
  };