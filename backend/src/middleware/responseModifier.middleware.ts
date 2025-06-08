export const successResponse = (res: any, data: any, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const errorResponse = (res: any, message: string, status: number = 500) => {
  return res.status(status).json({ error: message });
};
