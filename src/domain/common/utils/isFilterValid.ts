export function isFilterValid(filters: { startTime: string; endTime: string; attendees: number }) {
  const hasTimeInputs = filters.startTime !== '' && filters.endTime !== '';

  if (!hasTimeInputs) {
    return false;
  }

  return filters.endTime > filters.startTime && filters.attendees >= 1;
}
