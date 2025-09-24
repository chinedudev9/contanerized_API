export const cookies = {
  getOptions: () => ({sameSite: 'strict'}),
  set: (res, name, value, options = {}) => {
    res.cookies(name, value, { ...cookies.getOptions(), ...options });
  },
  
  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options});
  },

  get: (req, name) => {
    return request.cookies[name];
  }
}