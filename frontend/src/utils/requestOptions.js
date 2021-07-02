export const NO_TOKEN_OPTIONS = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const authOptions = (accessToken) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
};
