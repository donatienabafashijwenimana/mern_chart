# TODO: resolve resetpassword and signup link problem

- [x] Update backend user schema to store reset token + expiry

- [x] Implement forgot password controller endpoint (generate token, store hash+expiry, return/test link)
- [x] Implement reset password controller endpoint (validate token, update password, clear token)
- [x] Add backend routes under /auth for forgot-password and reset-password/:token

- [x] Verify frontend API paths match backend routes
- [ ] Run server + client and test reset-password flow end-to-end


