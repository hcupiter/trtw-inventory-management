export const errorWriter = (error: any, defaultError?: string) => {
  if (error instanceof Error) {
    return error.message;
  } else {
    if (defaultError) {
      return defaultError;
    }
    return "An unexpected error occurred.";
  }
};
