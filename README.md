# DMARC Email Worker Enhanced

Enhanced DMARC Email Worker with UniCloud integration for comprehensive email processing and storage.

## 🚀 Features

- **Complete Email Processing**: Handles all email types (regular emails, attachments, DMARC reports)
- **PostalMime Integration**: Professional email parsing with proper MIME handling
- **UniCloud Storage**: Saves emails and attachments to UniCloud database and cloud storage
- **DMARC Report Analysis**: Full XML parsing and data extraction for DMARC reports
- **Comprehensive Logging**: Detailed processing logs for debugging and monitoring
- **Error Handling**: Robust error handling with retry mechanisms
- **Chinese Support**: Proper handling of Chinese content and MIME encoding

## 📋 Supported Email Types

1. **Regular Emails**: Standard emails without attachments
2. **Emails with Attachments**: Any email containing file attachments
3. **DMARC Reports**: XML/ZIP/GZ formatted DMARC aggregate reports

## 🏗️ Architecture

```
Email → Cloudflare Workers → PostalMime Parser → UniCloud Function → Database + Cloud Storage
```

## 📦 Dependencies

- **postal-mime**: Professional email parsing library
- **mime-db**: MIME type database for file type detection
- **unzipit**: ZIP file extraction for compressed DMARC reports
- **pako**: GZIP decompression for compressed attachments
- **fast-xml-parser**: XML parsing for DMARC report data

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Wrangler

Update `wrangler.toml` with your worker name and domain settings.

### 3. Deploy

```bash
npm run deploy
```

### 4. Configure Email Routing

In Cloudflare Dashboard:
1. Go to your domain's Email Routing settings
2. Add a route for DMARC reports (e.g., `dmarc@yourdomain.com`)
3. Set the destination to your deployed worker

## 📊 Data Storage

### Email Information Stored:
- Sender and recipient addresses
- Subject (with proper MIME decoding)
- Date and message ID
- Complete HTML and text content
- Content length statistics

### Attachment Information:
- Filename and MIME type
- File size and disposition
- Content uploaded to UniCloud storage
- Storage URL reference

### DMARC Report Data:
- Report metadata (organization, ID, date range)
- Published policy information
- Individual record details (IP, count, results)
- Policy evaluation results

## 🔍 Monitoring

### View Logs
```bash
npx wrangler tail
```

### Debug Mode
```bash
npx wrangler dev --local
```

## 📈 Processing Flow

1. **Email Reception**: Worker receives email via Cloudflare Email Routing
2. **Content Parsing**: PostalMime extracts all email components
3. **Attachment Processing**: Detects and processes any attachments
4. **DMARC Analysis**: Attempts to parse attachments as DMARC reports
5. **Data Preparation**: Formats data for UniCloud function
6. **Cloud Storage**: Saves complete email data to UniCloud
7. **Response Logging**: Records processing results and statistics

## 🛡️ Security Features

- Input sanitization for all email content
- Safe handling of binary attachments
- Error isolation to prevent worker crashes
- Timeout protection for external API calls
- Retry mechanisms for network failures

## 📝 Configuration

### Environment Variables
Add any required environment variables to `wrangler.toml`:

```toml
[vars]
UNICLOUD_FUNCTION_URL = "your-unicloud-function-url"
DEBUG_MODE = "false"
```

### UniCloud Function URL
Update the `cloudFunctionUrl` in `src/index.ts` to match your UniCloud function endpoint.

## 🔧 Development

### Local Development
```bash
npm run dev
```

### Type Checking
```bash
npx tsc --noEmit
```

### Build Check
```bash
npm run build
```

## 📊 Performance

- **Processing Time**: Typically 100-500ms per email
- **Memory Usage**: Optimized for Cloudflare Workers limits
- **Timeout Protection**: 30-second timeout with retry logic
- **Payload Optimization**: Automatic compression for large emails

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are properly installed
2. **Timeout Issues**: Check UniCloud function response time
3. **Parsing Failures**: Review email format and encoding
4. **Storage Errors**: Verify UniCloud function URL and permissions

### Debug Information

The worker provides comprehensive logging including:
- Email parsing details
- Attachment information
- DMARC report structure
- API call results
- Error stack traces

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the logs using `npx wrangler tail`
2. Review the troubleshooting section
3. Create an issue with detailed error information