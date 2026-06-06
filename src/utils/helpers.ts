export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getStatusColor = (status: string): string => {
  const colors = {
    pending: 'gold',
    approved: 'green',
    rejected: 'red',
  };
  return colors[status as keyof typeof colors] || 'default';
};

export const getPriorityLabel = (priority: string): string => {
  const labels = {
    none: 'No Priority',
    group1: 'Group 1 (Ethnic minority)',
    group2: 'Group 2 (Policy beneficiaries)',
    group3: 'Group 3 (Other priorities)',
  };
  return labels[priority as keyof typeof labels] || priority;
};