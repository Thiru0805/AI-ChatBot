export const successResponse = (res: any, data: any, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const errorResponse = (res: any, error: string, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, error });
};
