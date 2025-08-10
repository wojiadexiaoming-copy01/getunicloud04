import {
  Env,
  Email,
  Attachment,
  Address,
} from './types'

export default {
  // HTTP请求处理函数
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response('DMARC Email Worker Debug Parser is running!', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  // 邮件处理函数 - 只专注于解析，不调用云函数
  async email(message: any, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('🚀 ===== DEBUG: Email Parser Started =====')
    console.log('📧 Received email at:', new Date().toISOString())
    console.log('📨 Message from:', message.from)
    console.log('📬 Message to:', message.to)
    console.log('📝 Message subject:', message.headers.get('subject') || 'No subject')
    console.log('📏 Message size:', message.raw?.length || 'unknown', 'bytes')

    try {
      await debugEmailParsing(message)
      console.log('✅ ===== DEBUG: Email Parsing Completed =====')
    } catch (error) {
      console.error('❌ ===== DEBUG: Email Parsing Failed =====')
      console.error('💥 Error details:', error)
      
      if (error instanceof Error) {
        console.error('📋 Error stack:', error.stack)
        console.error('📋 Error name:', error.name)
        console.error('📋 Error message:', error.message)
      }
    }
  },
}

async function debugEmailParsing(message: any): Promise<void> {
  console.log('🔧 ===== DEBUG: Starting Email Analysis =====')

  try {
    // 步骤1: 检查原始数据
    console.log('📖 Step 1: Analyzing raw message data...')
    console.log('  - Message type:', typeof message)
    console.log('  - Message keys:', message ? Object.keys(message) : 'null')
    console.log('  - Has raw property:', !!message.raw)
    console.log('  - Raw type:', message.raw ? typeof message.raw : 'N/A')
    
    if (!message.raw) {
      throw new Error('Message raw content is missing')
    }
    
    // 步骤2: 转换为可读格式
    console.log('📖 Step 2: Converting raw data to readable format...')
    const rawEmail = new Response(message.raw)
    console.log('  - Response created successfully')
    
    const arrayBuffer = await rawEmail.arrayBuffer()
    console.log('  - ArrayBuffer size:', arrayBuffer.byteLength, 'bytes')
    
    // 步骤3: 解码为文本
    console.log('📖 Step 3: Decoding to text...')
    const decoder = new TextDecoder('utf-8')
    const emailText = decoder.decode(arrayBuffer)
    console.log('  - Text length:', emailText.length, 'characters')
    
    // 步骤4: 显示原始邮件内容的关键部分
    console.log('📖 Step 4: Analyzing email structure...')
    console.log('🔍 === EMAIL RAW CONTENT (First 800 chars) ===')
    console.log(emailText.substring(0, 800))
    console.log('🔍 === EMAIL RAW CONTENT (Last 200 chars) ===')
    console.log(emailText.substring(Math.max(0, emailText.length - 200)))
    
    // 步骤5: 分离头部和正文
    console.log('📖 Step 5: Separating headers and body...')
    const headerBodySplit = emailText.split(/\r?\n\r?\n/)
    console.log('  - Split into', headerBodySplit.length, 'sections')
    
    const headerSection = headerBodySplit[0] || ''
    const bodySection = headerBodySplit.slice(1).join('\n\n') || ''
    
    console.log('  - Header section length:', headerSection.length, 'chars')
    console.log('  - Body section length:', bodySection.length, 'chars')
    
    // 步骤6: 显示头部内容
    console.log('📖 Step 6: Analyzing headers...')
    console.log('🔍 === HEADER SECTION ===')
    console.log(headerSection)
    
    // 步骤7: 解析头部
    console.log('📖 Step 7: Parsing headers...')
    const headers: Record<string, string> = {}
    const headerLines = headerSection.split(/\r?\n/)
    let currentHeader = ''
    
    for (const line of headerLines) {
      if (line.match(/^\s/)) {
        // 继续上一个头部
        if (currentHeader) {
          headers[currentHeader] += ' ' + line.trim()
        }
      } else {
        const match = line.match(/^([^:]+):\s*(.*)$/)
        if (match) {
          currentHeader = match[1].toLowerCase()
          headers[currentHeader] = match[2]
        }
      }
    }
    
    console.log('  - Parsed headers:', Object.keys(headers))
    console.log('  - Content-Type:', headers['content-type'] || 'Not found')
    console.log('  - Subject:', headers['subject'] || 'Not found')
    console.log('  - From:', headers['from'] || 'Not found')
    console.log('  - To:', headers['to'] || 'Not found')
    
    // 步骤8: 检查是否是多部分邮件
    console.log('📖 Step 8: Checking if multipart email...')
    const contentType = headers['content-type'] || ''
    const isMultipart = contentType.includes('multipart')
    console.log('  - Is multipart:', isMultipart)
    console.log('  - Content-Type full:', contentType)
    
    if (isMultipart) {
      // 步骤9: 提取边界
      console.log('📖 Step 9: Extracting boundary...')
      const boundaryMatch = contentType.match(/boundary=["']?([^"';,\s]+)["']?/)
      if (boundaryMatch) {
        const boundary = boundaryMatch[1]
        console.log('  - Found boundary:', boundary)
        
        // 步骤10: 显示正文内容
        console.log('📖 Step 10: Analyzing body content...')
        console.log('🔍 === BODY SECTION (First 500 chars) ===')
        console.log(bodySection.substring(0, 500))
        
        // 步骤11: 分割部分
        console.log('📖 Step 11: Splitting parts by boundary...')
        const boundaryPattern = `--${boundary}`
        console.log('  - Looking for pattern:', boundaryPattern)
        
        // 简单分割
        const parts = bodySection.split(boundaryPattern)
        console.log('  - Found', parts.length, 'parts after split')
        
        // 显示每个部分的信息
        parts.forEach((part, index) => {
          console.log(`🔍 === PART ${index} (Length: ${part.length}) ===`)
          if (part.length > 0) {
            console.log('First 200 chars:')
            console.log(part.substring(0, 200))
            console.log('---')
          }
        })
        
        // 步骤12: 尝试解析有效部分
        console.log('📖 Step 12: Analyzing valid parts...')
        for (let i = 1; i < parts.length - 1; i++) {
          const part = parts[i].trim()
          if (!part) {
            console.log(`  - Part ${i}: Empty, skipping`)
            continue
          }
          
          console.log(`  - Part ${i}: ${part.length} characters`)
          
          // 分离部分的头部和内容
          const partSplit = part.split(/\r?\n\r?\n/)
          const partHeaders = partSplit[0] || ''
          const partContent = partSplit.slice(1).join('\n\n') || ''
          
          console.log(`    - Part ${i} headers: ${partHeaders.length} chars`)
          console.log(`    - Part ${i} content: ${partContent.length} chars`)
          
          // 显示部分头部
          console.log(`🔍 === PART ${i} HEADERS ===`)
          console.log(partHeaders)
          
          // 显示部分内容预览
          if (partContent.length > 0) {
            console.log(`🔍 === PART ${i} CONTENT (First 200 chars) ===`)
            console.log(partContent.substring(0, 200))
          }
          
          // 解析部分头部
          const partHeadersObj: Record<string, string> = {}
          const partHeaderLines = partHeaders.split(/\r?\n/)
          for (const line of partHeaderLines) {
            const match = line.match(/^([^:]+):\s*(.*)$/)
            if (match) {
              partHeadersObj[match[1].toLowerCase()] = match[2]
            }
          }
          
          console.log(`    - Part ${i} Content-Type:`, partHeadersObj['content-type'] || 'Not found')
          console.log(`    - Part ${i} Content-Transfer-Encoding:`, partHeadersObj['content-transfer-encoding'] || 'Not found')
          
          // 检查是否是文本内容
          const partContentType = partHeadersObj['content-type'] || ''
          if (partContentType.includes('text/html')) {
            console.log(`    ✅ Part ${i} is HTML content!`)
          } else if (partContentType.includes('text/plain')) {
            console.log(`    ✅ Part ${i} is plain text content!`)
          } else {
            console.log(`    ❓ Part ${i} content type:`, partContentType)
          }
        }
        
      } else {
        console.log('  - ❌ No boundary found in multipart email')
      }
    } else {
      console.log('  - Single-part email, body content:')
      console.log('🔍 === SINGLE PART BODY ===')
      console.log(bodySection.substring(0, 500))
    }
    
    console.log('🎯 ===== DEBUG: Email Analysis Completed =====')
    
  } catch (error) {
    console.error('❌ Debug parsing error:', error)
    throw error
  }
}
