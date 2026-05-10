// ============================================
// PDF 文本提取脚本 - 生成搜索索引
// 用法: node scripts/extract-pdf-index.mjs
// 输出: public/pdf-search-index.json
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'public', 'docs');

// PDF 文件名按照 UI 中显示的顺序映射
// GBStandardsSection, LocalStandardsSection, LawsSection 中定义的顺序
const pdfDisplayOrder = [
  { file: '0.《南宁市管道燃气工程技术标准》（2019年修编版）.pdf', category: '规范标准', section: 'standards' },
  { file: '1.《燃气工程项目规范》GB55009-2021.pdf', category: '规范标准', section: 'standards' },
  { file: '2.《城镇燃气设计规范》(2020年版)GB50028-2006.pdf', category: '规范标准', section: 'standards' },
  { file: '3.《城镇燃气室内工程施工与质量验收规范》CJJ94-2009.pdf', category: '规范标准', section: 'standards' },
  { file: '4.《城镇燃气报警控制系统技术规程》CJJT146-2011.pdf', category: '规范标准', section: 'standards' },
  { file: '5.《家用燃气燃烧器具安装及验收规程》CJJ12-2013.pdf', category: '规范标准', section: 'standards' },
  { file: '6.《城镇燃气设施运行、维护和抢修安全技术规程》CJJ51-2016.pdf', category: '规范标准', section: 'standards' },
  { file: '广西燃气管理条例（公告+文本）2023-3-30.pdf', category: '地方法规', section: 'standards' },
  { file: '南宁市燃气管理条例（2021-08-06发布实施）.doc', category: '地方法规', section: 'standards' },
  { file: '关于明确燃气设施保护范围及有关要求的通知 (南宁住建).pdf', category: '地方法规', section: 'standards' },
  { file: '南宁市发展和改革委员会关于南宁市市区管道燃气价格联动有关事项的通知_南发改规〔2025〕4号.pdf', category: '地方法规', section: 'standards' },
  { file: '南住建函〔2025〕671号关于征求《南宁市燃气管理条例（修订草案）（征求意见稿）》修改意见的函.pdf', category: '地方法规', section: 'standards' },
  { file: '法规_城镇燃气管理条例.pdf', category: '法律法规', section: 'scores' },
  { file: '中华人民共和国安全生产法（2021年6月修订）.pdf', category: '法律法规', section: 'scores' },
  { file: '法规_消防法.pdf', category: '法律法规', section: 'scores' },
  { file: '法规_特种设备安全法.pdf', category: '法律法规', section: 'scores' },
  { file: '法规_刑法.pdf', category: '法律法规', section: 'scores' },
];

function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/[　\u200B-\u200D\uFEFF]+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function chunkText(text, maxChunkSize = 300) {
  // 先按段落拆分
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
  const chunks = [];
  let currentChunk = '';
  let currentSize = 0;

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (cleanPara.length === 0) continue;

    if (currentSize + cleanPara.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
      currentSize = 0;
    }

    if (cleanPara.length > maxChunkSize) {
      // 长段落分割
      let start = 0;
      while (start < cleanPara.length) {
        const end = Math.min(start + maxChunkSize, cleanPara.length);
        let breakPoint = end;
        // 尝试在句号处断开
        if (end < cleanPara.length) {
          const lastPeriod = cleanPara.lastIndexOf('。', end);
          const lastSemicolon = cleanPara.lastIndexOf('；', end);
          if (lastPeriod > start && end - lastPeriod < 50) breakPoint = lastPeriod + 1;
          else if (lastSemicolon > start && end - lastSemicolon < 50) breakPoint = lastSemicolon + 1;
        }
        const segment = cleanPara.slice(start, breakPoint).trim();
        if (segment.length > 20) chunks.push(segment);
        start = breakPoint;
      }
    } else {
      currentChunk = (currentChunk + ' ' + cleanPara).trim();
      currentSize = currentChunk.length;
    }
  }

  if (currentChunk.trim().length > 20) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function extractPdfText(filePath) {
  try {
    const { PDFParse } = require('pdf-parse');
    const buf = fs.readFileSync(filePath);
    const parser = new PDFParse(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
    await parser.load();
    const result = await parser.getText();
    const text = typeof result.text === 'string' ? result.text : '';
    return cleanText(text);
  } catch (err) {
    console.error(`  提取失败: ${err.message}`);
    return '';
  }
}

// 获取 PDF 文件显示名称（去掉序号前缀和扩展名）
function getDisplayName(filename) {
  let name = filename.replace(/\.pdf$/i, '').replace(/\.doc$/i, '');
  // 去掉序号前缀如 "0." "1."
  name = name.replace(/^\d+\./, '').trim();
  // 去掉下划线变空格
  name = name.replace(/_/g, ' ');
  return name;
}

async function main() {
  console.log('📄 开始提取 PDF 文本...\n');

  // 检查 pdf-parse 是否可用
  try {
    require.resolve('pdf-parse');
  } catch {
    console.error('❌ 请先安装 pdf-parse: npm install --no-save --legacy-peer-deps pdf-parse');
    process.exit(1);
  }

  const entries = [];

  for (const item of pdfDisplayOrder) {
    const filePath = path.join(docsDir, item.file);
    const isDoc = item.file.toLowerCase().endsWith('.doc');

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ 文件不存在: ${item.file}`);
      // 仍然添加条目，但文本为空
      entries.push({
        fileName: item.file,
        displayName: getDisplayName(item.file),
        pdfLink: `./docs/${encodeURI(item.file)}`,
        category: item.category,
        section: item.section,
        chunks: [],
      });
      continue;
    }

    console.log(`📖 ${isDoc ? '跳过.doc' : '提取'}: ${item.file}`);

    if (isDoc) {
      // .doc 文件只保留文件名（无文本内容）
      entries.push({
        fileName: item.file,
        displayName: getDisplayName(item.file),
        pdfLink: `./docs/${encodeURI(item.file)}`,
        category: item.category,
        section: item.section,
        chunks: [],
      });
      continue;
    }

    const text = await extractPdfText(filePath);
    if (!text) {
      console.log(`  文本为空`);
      entries.push({
        fileName: item.file,
        displayName: getDisplayName(item.file),
        pdfLink: `./docs/${encodeURI(item.file)}`,
        category: item.category,
        section: item.section,
        chunks: [],
      });
      continue;
    }

    const chunks = chunkText(text);
    console.log(`  → ${text.length} 字符, ${chunks.length} 片段`);

    entries.push({
      fileName: item.file,
      displayName: getDisplayName(item.file),
      pdfLink: `./docs/${encodeURI(item.file)}`,
      category: item.category,
      section: item.section,
      chunks,
    });
  }

  // 生成 JSON 索引文件（放 public/ 下，运行时异步加载）
  const jsonContent = JSON.stringify({
    generatedAt: new Date().toISOString(),
    entries,
  }, null, 2);

  const outputPath = path.join(rootDir, 'public', 'pdf-search-index.json');
  fs.writeFileSync(outputPath, jsonContent, 'utf-8');
  const fileSize = (Buffer.byteLength(jsonContent, 'utf-8') / 1024).toFixed(1);
  console.log(`\n✅ 索引已生成: public/pdf-search-index.json (${fileSize} KB)`);
}

main().catch(console.error);
