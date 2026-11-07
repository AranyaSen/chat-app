export const generateDirectKey = (
  currentUserId: string,
  receiverId: string,
) => {
  return [currentUserId, receiverId].sort().join("-");
};
