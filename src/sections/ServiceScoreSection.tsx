import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { ClipboardCheck, Construction, AlertTriangle } from 'lucide-react';

export default function ServiceScoreSection() {

  const scoreItems = [
    { category: '服务质量严重事件', score: '12分/次', examples: ['与用户发生肢体冲突', '收受用户财物', '泄露用户隐私信息', '伪造服务记录'], desc: '严重损害公司形象和用户信任的行为' },
    { category: '服务质量重大事件', score: '6分/次', examples: ['服务态度恶劣被投诉', '工单超期未处理', '虚假安检/虚假维修', '违规收费'], desc: '影响用户体验和公司声誉的行为' },
    { category: '服务质量一般事件', score: '3分/次', examples: ['未按预约时间上门', '服务后未清理现场', '用户回访不满意', '着装不规范'], desc: '服务标准执行不到位的行为' },
    { category: '服务质量轻微事件', score: '1分/次', examples: ['未佩戴工牌', '未主动出示证件', '服务用语不规范', '未及时回复用户咨询'], desc: '服务细节不到位但不影响整体体验的行为' },
  ];

  return (
    <div className="space-y-6">
        
        <AccordionGroup className="space-y-3">
          {scoreItems.map((item, i) => (
            <AccordionItem key={i} id={`service-${i}`} title={item.category} summary={`${item.score} · ${item.desc}`}
              icon={<ClipboardCheck className="w-5 h-5" />}
              badge={<span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: item.score.includes('12') ? 'rgba(227,24,55,0.1)' : item.score.includes('6') ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.06)', color: item.score.includes('12') ? '#E31837' : item.score.includes('6') ? '#F59E0B' : '#3B82F6' }}>{item.score}</span>}
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
              <div className="mt-3 dark-card bg-[var(--card-inner-bg)] border border-dashed border-[var(--border-light)] rounded-lg p-4 flex items-center gap-3">
                <Construction className="w-5 h-5 text-white" />
                <span className="text-[#E31837] text-xs font-medium">【待补充】完整记分细则、申诉流程、服务培训方案。内容正在由服务运营主管整理中，预计2026年Q2完成录入。</span>
              </div>
            </AccordionItem>
          ))}
        </AccordionGroup>

        <div className="mt-6 bg-[rgba(200,16,46,0.03)] border border-[rgba(200,16,46,0.08)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <p className="text-xs text-white">
              本模块收录中燃集团客户服务质量记分管理制度全文及客户服务部执行细则。内容正在由服务运营主管整理中，预计2026年Q2完成录入。服务质量记分与月度绩效奖金挂钩，每季度公布一次记分排名。新员工入职首月为观察期，不计入记分考核。
            </p>
          </div>
        </div>
      </div>
  );
}
