export const clientError = (message: string, res) => {
  return res.status(400).json({ message });
};

export const ok = (message: string, res, result?: any) => {
  return res.json({ message, result });
};

export const created = (message: string, res, result?: any) => {
  return res.status(201).json({ message, result });
};

export const notFound = (message: string, res) => {
  return res.status(404).json({ message });
};

export const authError = (message: string, res) => {
  return res.status(401).json({ message });
};

export const serverError = (message: string, res) => {
  return res.status(500).json({ message });
};

export const forbidden = (message: string, res) => {
  return res.status(403).json({ message });
};
