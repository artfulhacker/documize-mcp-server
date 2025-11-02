# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **Open a GitHub Issue** with the `security` label
2. **Or contact**: See GitHub profile for contact info
3. **Provide**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact

I'll respond as soon as possible and work on a fix.

## Security Best Practices

### Protecting Your Credentials

1. **Never commit credentials** - Add `.env` to `.gitignore`
2. **Use environment variables**:
   ```bash
   export DOCUMIZE_API_URL="https://your-instance.com"
   export DOCUMIZE_API_CREDENTIALS="base64-encoded-credentials"
   ```
3. **Rotate passwords regularly** in your Documize instance
4. **Use HTTPS** - Always use `https://` URLs

### Credential Storage

For different environments:

**Local Development:**
```bash
# .env file (never commit this)
DOCUMIZE_API_URL=https://your-instance.com
DOCUMIZE_API_CREDENTIALS=base64string
```

**VS Code:**
- Credentials stored in `.vscode/mcp.json` (gitignored)
- Or use VS Code's Secret Storage extension

**Claude Desktop:**
- Credentials in `claude_desktop_config.json`
- File permissions should be restricted (chmod 600)

### Updates

- Watch this repository for updates
- Check `CHANGELOG.md` for security fixes
- Run `npm audit` periodically to check dependencies

## Known Considerations

- **STDIO Transport**: Communication is unencrypted, only use with trusted local clients
- **Environment Variables**: Can be read by other processes on your machine
- **API Tokens**: Are stored in memory while the server runs

For production use, consider additional security measures appropriate to your environment.

---

**Repository**: https://github.com/artfulhacker/documize-mcp-server
