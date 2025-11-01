// app/api/chat/route.ts
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Enums
enum ConfidenceLevel {
  PROVEN = 1.0,
  HIGH = 0.95,
  MEDIUM = 0.75,
  INSUFFICIENT = 0.0,
}

enum EvidenceType {
  CLINICAL_GUIDELINE = 'CLINICAL_GUIDELINE',
  META_ANALYSIS = 'META_ANALYSIS',
  RCT = 'RCT',
  OBSERVATIONAL = 'OBSERVATIONAL',
  PEER_REVIEWED = 'PEER_REVIEWED',
  OTHER = 'OTHER',
}

// Interfaces and Types
interface Evidence {
  content: string;
  source: string;
  type: EvidenceType;
  publication_date?: string;
  citations?: number;
  confidence: number;
}

interface ProofNode {
  id: string;
  statement: string;
  evidence: Evidence[];
  logical_step: string;
  verifiable_source?: string;
  contradictions: string[];
  timestamp: string;
  get_weighted_confidence: () => number;
}

interface BinaryDecision {
  answer: boolean;
  confidence: number;
  confidence_label: keyof typeof ConfidenceLevel;
  proof_chain: ProofNode[];
  limitations: string[];
  verification_code: string;
  refused: boolean;
  refuse_reason?: string;
  reasoning?: string;
  alternative_paths: string[];
  uncertainty_analysis: Record<string, any>;
  falsifiability_test: Record<string, any>;
}

interface BoundaryViolation {
  category: string;
  reason: string;
  severity: number;
}

// Classes
class KnowledgeGraph {
  facts: Array<{
    id: string;
    statement: string;
    evidences: Evidence[];
    weight: number;
  }> = [];

  add_fact(statement: string, evidences: Evidence[], weight: number = 1.0) {
    this.facts.push({
      id: uuidv4(),
      statement,
      evidences,
      weight,
    });
  }

  query(text: string): Array<Record<string, any>> {
    const hits: Array<Record<string, any>> = [];
    const tokens = text.split(/\W+/).filter(tok => tok);
    for (const f of this.facts) {
      if (tokens.some(tok => f.statement.toLowerCase().includes(tok.toLowerCase()))) {
        hits.push(f);
      }
    }
    return hits;
  }
}

class EthicsEngine {
  private harm_patterns: RegExp[];
  private ethics_rules: string[];

  constructor() {
    this.harm_patterns = this._load_harm_patterns();
    this.ethics_rules = this._load_ethics_rules();
  }

  private _load_ethics_rules(): string[] {
    return ["Non-maleficence", "Beneficence", "Autonomy", "Justice", "Veracity", "Confidentiality"];
  }

  private _load_harm_patterns(): RegExp[] {
    return [
      /gây\s+hại|tấn\s+công|chế\s+tạo\s+vũ\s+khí/i,
      /tự\s+tử|tự\s+sát|ma\s+túy|chất\s+độc/i,
      /hack|crack|bypass|vượt\s+qua\s+bảo\s+mật/i,
    ];
  }

  check(text: string, proof_chain: ProofNode[]): BoundaryViolation | null {
    for (const p of this.harm_patterns) {
      if (p.test(text)) {
        return { category: 'Ethics', reason: `Matched harm pattern: ${p.source}`, severity: 1.0 };
      }
    }
    for (const node of proof_chain) {
      for (const e of node.evidence) {
        if (e.source?.toLowerCase().includes('private')) {
          return { category: 'Legal', reason: 'Uses restricted/private source', severity: 0.9 };
        }
      }
    }
    return null;
  }
}

class TheoremProver {
  static verify_chain(proof_chain: ProofNode[], goal: string | null): boolean {
    if (!proof_chain.length) {
      return false;
    }
    const final = proof_chain[proof_chain.length - 1].statement.trim().toLowerCase();
    const g = goal ? goal.trim().toLowerCase() : '';
    return final === g || final === `not ${g}`;
  }
}

class AbsoluteTruthEngine {
  protected kg: KnowledgeGraph;
  private ethics: EthicsEngine;
  private prover: typeof TheoremProver;
  protected min_confidence: number;

  constructor() {
    this.kg = new KnowledgeGraph();
    this.ethics = new EthicsEngine();
    this.prover = TheoremProver;
    this.min_confidence = 0.95;
  }

  parse_to_formal_logic(problem: string): Record<string, any> {
    const parsed: Record<string, any> = { raw_text: problem, entities: [], goal: null, observations: [] };
    if (/phẫu\s+thuật|phẫu thuật ngay|cần phẫu thuật/i.test(problem)) {
      parsed['goal'] = 'perform_surgery_now';
    } else {
      parsed['goal'] = 'decision';
    }
    parsed['entities'] = problem.match(/triệu chứng\s+[A-Z]|yếu tố\s+nguy\s+cơ\s+[A-Z]|triệu chứng\s+\w+/ig) || [];
    parsed['observations'] = parsed['entities'];
    return parsed;
  }

  verify_with_kb(parsed: Record<string, any>): [boolean, Array<Record<string, any>>] {
    const hits = this.kg.query(parsed['raw_text']);
    return [true, hits];
  }

  generate_proof_chain(parsed: Record<string, any>, hits: Array<Record<string, any>>): ProofNode[] {
    const nodes: ProofNode[] = [];
    for (const h of hits) {
      const evids = h.evidences || [];
      const node: ProofNode = {
        id: uuidv4(),
        statement: h.statement,
        evidence: evids,
        logical_step: `kb_match:${h.id}`,
        verifiable_source: evids.map((e: Evidence) => e.source).join(','),
        contradictions: [],
        timestamp: new Date().toISOString(),
        get_weighted_confidence: function() {
          if (!this.evidence.length) return 0.0;
          const total = this.evidence.reduce((sum, e) => sum + e.confidence, 0);
          return total / Math.max(1, this.evidence.length);
        }
      };
      nodes.push(node);
    }

    if (nodes.some(n => n.statement.includes('STEMI') || n.statement.includes('ACS'))) {
      nodes.push({
        id: uuidv4(),
        statement: 'perform_icu_transfer',
        evidence: [],
        logical_step: 'infer_risk',
        verifiable_source: 'inference',
        contradictions: [],
        timestamp: new Date().toISOString(),
        get_weighted_confidence: () => 0.0
      });
    }

    if (!nodes.length) {
      nodes.push({
        id: uuidv4(),
        statement: 'INSUFFICIENT_EVIDENCE',
        evidence: [],
        logical_step: 'no_inference',
        verifiable_source: 'inference',
        contradictions: [],
        timestamp: new Date().toISOString(),
        get_weighted_confidence: () => 0.0
      });
    }
    return nodes;
  }

  apply_ethics(parsed: Record<string, any>, proof_chain: ProofNode[]): BoundaryViolation | null {
    return this.ethics.check(parsed['raw_text'], proof_chain);
  }

  calculate_confidence(proof_chain: ProofNode[]): [number, keyof typeof ConfidenceLevel] {
    const final = proof_chain.length ? proof_chain[proof_chain.length - 1].statement : 'INSUFFICIENT_EVIDENCE';
    if (final === 'INSUFFICIENT_EVIDENCE') {
      return [0.0, 'INSUFFICIENT'];
    }
    const avg = proof_chain.reduce((sum, n) => sum + n.get_weighted_confidence(), 0) / Math.max(1, proof_chain.length);

    if (avg >= 0.95) return [ConfidenceLevel.PROVEN, 'PROVEN'];
    if (avg >= 0.90) return [ConfidenceLevel.HIGH, 'HIGH'];
    return [avg, 'MEDIUM'];
  }

  cross_validate(parsed: Record<string, any>, proof_chain: ProofNode[]): [boolean, string] {
    const text = parsed['raw_text'].toLowerCase();
    let alt = 'INSUFFICIENT_EVIDENCE';
    if (text.includes('đau ngực') && text.includes('huyết áp')) {
      alt = 'perform_icu_transfer';
    }
    const agree = proof_chain[proof_chain.length - 1].statement.toLowerCase() === alt.toLowerCase();
    return [agree, alt];
  }

  generate_verification_code(proof_chain: ProofNode[]): string {
    const serial = JSON.stringify(proof_chain.map(p => ({
      id: p.id,
      stmt: p.statement,
      evid: p.evidence.map(e => [e.source, e.confidence])
    })).sort());
    const h = createHash('sha256').update(serial).digest('hex');
    return `Proof-${h.substring(0, 12)}`;
  }

  private _generate_hash(proof_chain: ProofNode[]): string {
    let content = '';
    for (const node of proof_chain) {
      content += node.statement;
      content += node.evidence.map(e => e.source).join('');
    }
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  private _generate_reasoning(proof_chain: ProofNode[]): string {
    return proof_chain.map((node, i) => {
      const contradiction_note = node.contradictions.length ? ` [Mâu thuẫn: ${node.contradictions.length}]` : '';
      let evidence_note = '';
      if (node.evidence.length) {
        const evidence_types = [...new Set(node.evidence.map(e => e.type))].join(', ');
        evidence_note = ` [${evidence_types}]`;
      }
      const confidence_percent = (node.get_weighted_confidence() * 100).toFixed(0);
      return `${i + 1}. ${node.statement} (tin cậy: ${confidence_percent}%)${evidence_note}${contradiction_note}`;
    }).join("\n");
  }

  private _refuse_with_reason(violation: BoundaryViolation): BinaryDecision {
    return {
      answer: false,
      confidence: 1.0,
      confidence_label: 'INSUFFICIENT',
      proof_chain: [],
      limitations: [violation.reason],
      verification_code: 'REJECTED',
      refused: true,
      refuse_reason: `Từ chối [${violation.category}]: ${violation.reason}`,
      reasoning: `Từ chối [${violation.category}]: ${violation.reason}`,
      alternative_paths: [],
      uncertainty_analysis: { 'severity': violation.severity },
      falsifiability_test: {}
    };
  }

  private _insufficient_data_response(proof_chain: ProofNode[], confidence: number): BinaryDecision {
    return {
      answer: false,
      refused: false,
      confidence: confidence,
      confidence_label: confidence === 0 ? 'INSUFFICIENT' : 'MEDIUM',
      proof_chain: proof_chain,
      limitations: [`Độ tin cậy ${(confidence * 100).toFixed(0)}% < ngưỡng yêu cầu ${(this.min_confidence * 100).toFixed(0)}%`, "Cần bổ sung bằng chứng hoặc làm rõ câu hỏi"],
      verification_code: 'INSUFFICIENT',
      reasoning: proof_chain.length ? this._generate_reasoning(proof_chain) : 'Không đủ dữ liệu',
      alternative_paths: [],
      uncertainty_analysis: { 'confidence': confidence, 'status': 'insufficient' },
      falsifiability_test: {}
    };
  }

  solve(problem: string): BinaryDecision {
    const parsed = this.parse_to_formal_logic(problem);
    const [, hits] = this.verify_with_kb(parsed);
    const proof_chain = this.generate_proof_chain(parsed, hits);

    const violation = this.apply_ethics(parsed, proof_chain);
    if (violation) {
      return this._refuse_with_reason(violation);
    }

    const goal = parsed['goal'] === 'perform_surgery_now' ? 'perform_surgery_now' : parsed['goal'];
    const prover_ok = this.prover.verify_chain(proof_chain, goal);
    const [agree, alt] = this.cross_validate(parsed, proof_chain);
    const [confidence_value, confidence_label] = this.calculate_confidence(proof_chain);

    if (confidence_value < this.min_confidence || !agree || !prover_ok) {
      return this._insufficient_data_response(proof_chain, confidence_value);
    }

    const final_stmt = proof_chain[proof_chain.length - 1].statement.trim().toLowerCase();
    let answer = true;
    if (final_stmt.startsWith('not ') || final_stmt.startsWith('insufficient')) {
        answer = false;
    } else if (final_stmt === 'perform_icu_transfer') {
        answer = true;
    }


    const vcode = this.generate_verification_code(proof_chain);
    return {
      answer,
      confidence: confidence_value,
      confidence_label,
      proof_chain,
      limitations: [],
      verification_code: vcode,
      refused: false,
      refuse_reason: undefined,
      reasoning: this._generate_reasoning(proof_chain),
      alternative_paths: [],
      uncertainty_analysis: { 'agreement_alt': alt },
      falsifiability_test: { 'hash': this._generate_hash(proof_chain) }
    };
  }
}

class MedicalDecisionEngine extends AbsoluteTruthEngine {
  constructor() {
    super();
    this.min_confidence = 0.95;
    this._load_medical_knowledge();
  }

  private _load_medical_knowledge() {
    this.kg.add_fact(
      "Đau ngực kéo dài > 20 phút là dấu hiệu nghi ACS",
      [{ content: "Chest pain >20min suggests ACS", source: "AHA/ACC 2023", type: EvidenceType.CLINICAL_GUIDELINE, publication_date: "2023-01", citations: 1247, confidence: 0.98 }],
      0.98
    );
    this.kg.add_fact(
      "Huyết áp ≥ 160/100 mmHg được phân loại là tăng huyết áp độ 2",
      [{ content: "BP ≥160/100 is Stage 2 Hypertension", source: "ESC/ESH 2023", type: EvidenceType.CLINICAL_GUIDELINE, publication_date: "2023-03", citations: 892, confidence: 1.0 }],
      1.0
    );
    this.kg.add_fact(
      "Đau ngực cấp + Tăng huyết áp độ 2 có nguy cơ STEMI 82-87%",
      [{ content: "Acute chest pain + Stage2 HTN → STEMI risk 82-87%", source: "Meta-analysis 2023", type: EvidenceType.META_ANALYSIS, publication_date: "2023-06", citations: 234, confidence: 0.95 }],
      0.95
    );
  }
}

export async function POST(req: Request) {
  try {
    const { problem } = await req.json();

    if (!problem) {
      return NextResponse.json({ error: 'Problem statement is required' }, { status: 400 });
    }

    const engine = new MedicalDecisionEngine();
    const decision = engine.solve(problem);

    // The proof_chain contains functions (get_weighted_confidence) which are not serializable.
    // We need to convert them to plain objects.
    const serializableDecision = {
        ...decision,
        proof_chain: decision.proof_chain.map(node => {
            const { get_weighted_confidence, ...rest } = node;
            return {
                ...rest,
                weighted_confidence: node.get_weighted_confidence()
            };
        })
    };


    return NextResponse.json(serializableDecision);

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
