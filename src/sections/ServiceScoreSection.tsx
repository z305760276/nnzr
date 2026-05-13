import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { ClipboardCheck, Eye, FileSpreadsheet } from 'lucide-react';
import FilePreview from '../components/FilePreview';

const serviceScoreItems = [
  { category: '恶性违规行为', score: '12分/次', examples: ['安检入户造假（虚假照片）', '通气点火未做严密性试验', '违规置换/室内放散', '抄表弄虚作假乱填表数', '勾结偷盗气', '乱收费'], desc: '严重损害公司利益和形象的恶意违规行为，直接责任人扣12分' },
  { category: '严重违规行为', score: '6分/次', examples: ['隐患未整改却显示已整改', '到访不遇工单造假', '漏抄/错抄/未按计划抄表', '隐瞒包庇偷盗气', '泄漏客户信息', '使用他人账号操作'], desc: '违反操作规范可能导致严重后果的行为，直接责任人扣6分' },
  { category: '一般违规行为', score: '3分/次', examples: ['安检照片缺失/无用户签名', '未按约定时间上门', '未及时上报处置用户诉求', '服务态度导致投诉'], desc: '违反服务标准和工作流程的一般性行为，直接责任人扣3分' },
  { category: '轻微违规行为', score: '2分/次', examples: ['户内作业后未做安全宣传'], desc: '服务细节不到位但不直接影响安全的行为，直接责任人扣2分' },
];

export default function ServiceScoreSection() {
  const [preview, setPreview] = useState<{ filePath: string; fileName: string; fileType: 'pdf' | 'xlsx' } | null>(null);

  return (
    <div className="space-y-6">
      <AccordionGroup className="space-y-3">
        {serviceScoreItems.map((item, i) => (
          <AccordionItem key={i} id={`service-${i}`} title={item.category} summary={`${item.score} · ${item.desc}`}
            icon={<ClipboardCheck className="w-5 h-5" />}
            badge={<span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: item.score.includes('12') ? 'rgba(227,24,55,0.1)' : item.score.includes('6') ? 'rgba(245,158,11,0.08)' : item.score.includes('3') ? 'rgba(59,130,246,0.06)' : 'rgba(99,102,241,0.06)', color: item.score.includes('12') ? '#E31837' : item.score.includes('6') ? '#F59E0B' : item.score.includes('3') ? '#3B82F6' : '#6366F1' }}>{item.score}</span>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                <span className="text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">记分标准</span>
                <p className="text-sm text-[var(--text-primary)] font-medium mt-1">{item.score}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{item.desc}</p>
              </div>
              <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                <span className="text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">典型示例</span>
                <ul className="mt-1 space-y-1">
                  {item.examples.map((ex, j) => (
                    <li key={j} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#C8102E] mt-1.5 shrink-0" />{ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionItem>
        ))}
      </AccordionGroup>

      <div className="bg-[rgba(16,185,129,0.03)] border border-[rgba(16,185,129,0.12)] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-[#10B981]" />
          <div className="text-xs text-[var(--text-secondary)] space-y-1.5">
            <p className="text-white font-medium">参考文件</p>
            <button
              onClick={() => setPreview({ filePath: './docs/附件2.《中燃集团客服条口红黄线考核细则》.xlsx', fileName: '附件2.中燃集团客服条口红黄线考核细则.xlsx', fileType: 'xlsx' })}
              className="inline-flex items-center gap-1.5 text-[#C8102E] font-medium hover:underline cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              附件2. 中燃集团客服条口红黄线考核细则（Excel）
            </button>
            <button
              onClick={() => setPreview({ filePath: './docs/附件3.《客户服务部负面清单记分标准》.xlsx', fileName: '附件3.客户服务部负面清单记分标准.xlsx', fileType: 'xlsx' })}
              className="inline-flex items-center gap-1.5 text-[#C8102E] font-medium hover:underline cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              附件3. 客户服务部负面清单记分标准（Excel）
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <FilePreview
          open={!!preview}
          onClose={() => setPreview(null)}
          fileName={preview.fileName}
          filePath={preview.filePath}
          fileType={preview.fileType}
        />
      )}
    </div>
  );
}
