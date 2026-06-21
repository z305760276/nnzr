// 扫描 public/2025财年 目录，自动生成文件名清单（按子目录分组）
// 运行：node scripts/generate-rewards-files.mjs
import { readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'public', '2025财年');
const OUT_FILE = join(ROOT, 'src', 'data', 'rewardsFiles.ts');

const SUB_DIRS = [
  { id: 'company', folder: '公司级处罚', label: '公司级处罚', color: '#A855F7' },
  { id: 'dept',    folder: '部门级处罚', label: '部门级处罚', color: '#3B82F6' },
];

function ext(name) {
  const m = name.match(/\.([^.]+)$/);
  return m ? m[1].toLowerCase() : '';
}
function fileTypeOf(name) {
  const e = ext(name);
  if (e === 'pdf') return 'pdf';
  if (e === 'xlsx') return 'xlsx';
  if (e === 'xls') return 'xls';
  if (e === 'docx') return 'docx';
  return 'other';
}
function displayName(name) {
  return name.replace(/\.[^.]+$/, '');
}

const groups = [];
for (const sub of SUB_DIRS) {
  const dir = join(SRC_DIR, sub.folder);
  let files = [];
  try {
    files = readdirSync(dir)
      .filter(f => statSync(join(dir, f)).isFile())
      .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  } catch (e) {
    console.error('跳过目录：', dir, e.message);
  }
  groups.push({ ...sub, files });
}

const lines = [];
lines.push('// 此文件由 scripts/generate-rewards-files.mjs 自动生成，请勿手改');
lines.push('// 源目录：public/2025财年');
lines.push('');
lines.push('export type RewardsFileType = "pdf" | "xlsx" | "xls" | "docx";');
lines.push('');
lines.push('export interface RewardsFile {');
lines.push('  name: string;');
lines.push('  path: string;');
lines.push('  fileType: RewardsFileType;');
lines.push('}');
lines.push('');
lines.push('export interface RewardsGroup {');
lines.push('  id: string;');
lines.push('  folder: string;');
lines.push('  label: string;');
lines.push('  color: string;');
lines.push('  files: RewardsFile[];');
lines.push('}');
lines.push('');
lines.push('export const REWARDS_GROUPS: RewardsGroup[] = ' + JSON.stringify(
  groups.map(g => ({
    id: g.id, folder: g.folder, label: g.label, color: g.color,
    files: g.files.map(f => ({
      name: displayName(f),
      path: `./2025财年/${g.folder}/${f}`,
      fileType: fileTypeOf(f),
    })),
  })),
  null, 2,
) + ';');

writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
console.log('已生成：', OUT_FILE);
console.log('统计：', groups.map(g => `${g.folder}=${g.files.length}`).join(', '));
