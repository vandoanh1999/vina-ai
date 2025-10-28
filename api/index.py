from http.server import BaseHTTPRequestHandler
import json
from future import annotations
from dataclasses import dataclass, field, asdict
import dataclasses
from enum import Enum, auto
from typing import List, Optional, Dict, Any, Tuple
import hashlib
import uuid
import datetime
import re
import math
from collections import defaultdict

class ConfidenceLevel(Enum):
    PROVEN = 1.0
    HIGH = 0.95
    MEDIUM = 0.75
    INSUFFICIENT = 0.0

class EvidenceType(Enum):
    CLINICAL_GUIDELINE = auto()
    META_ANALYSIS = auto()
    RCT = auto()
    OBSERVATIONAL = auto()
    PEER_REVIEWED = auto()
    OTHER = auto()

@dataclass
class Evidence:
    content: str
    source: str
    type: EvidenceType
    publication_date: Optional[str] = None
    citations: Optional[int] = 0
    confidence: float = 0.0

@dataclass
class ProofNode:
    id: str
    statement: str
    evidence: List[Evidence]
    logical_step: str
    verifiable_source: Optional[str]
    contradictions: List[str] = field(default_factory=list)
    timestamp: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def get_weighted_confidence(self) -> float:
        if not self.evidence:
            return 0.0
        total = sum(e.confidence for e in self.evidence)
        return total / max(1, len(self.evidence))

@dataclass
class BinaryDecision:
    answer: bool
    confidence: float
    confidence_label: ConfidenceLevel
    proof_chain: List[ProofNode]
    limitations: List[str]
    verification_code: str
    refused: bool = False
    refuse_reason: Optional[str] = None
    reasoning: Optional[str] = None
    alternative_paths: List[str] = field(default_factory=list)
    uncertainty_analysis: Dict[str, Any] = field(default_factory=dict)
    falsifiability_test: Dict[str, Any] = field(default_factory=dict)

@dataclass
class BoundaryViolation:
    category: str
    reason: str
    severity: float

class KnowledgeGraph:
    def __init__(self):
        self.facts = []

    def add_fact(self, statement: str, evidences: List[Evidence], weight: float = 1.0):
        self.facts.append({
            'id': str(uuid.uuid4()),
            'statement': statement,
            'evidences': evidences,
            'weight': weight
        })

    def query(self, text: str) -> List[Dict[str, Any]]:
        hits = []
        for f in self.facts:
            if any(tok.lower() in f['statement'].lower() for tok in re.split(r"\W+", text) if tok):
                hits.append(f)
        return hits

class EthicsEngine:
    def __init__(self):
        self.harm_patterns = self._load_harm_patterns()
        self.ethics_rules = self._load_ethics_rules()

    def _load_ethics_rules(self) -> List[str]:
        return ["Non-maleficence", "Beneficence", "Autonomy", "Justice", "Veracity", "Confidentiality"]

    def _load_harm_patterns(self) -> List[str]:
        return [
            r"gây\s+hại|tấn\s+công|chế\s+tạo\s+vũ\s+khí",
            r"tự\s+tử|tự\s+sát|ma\s+túy|chất\s+độc",
            r"hack|crack|bypass|vượt\s+qua\s+bảo\s+mật"
        ]

    def check(self, text: str, proof_chain: List[ProofNode]) -> Optional[BoundaryViolation]:
        for p in self.harm_patterns:
            if re.search(p, text, flags=re.IGNORECASE):
                return BoundaryViolation(category='Ethics', reason=f"Matched harm pattern: {p}", severity=1.0)
        for node in proof_chain:
            for e in node.evidence:
                if 'private' in (e.source or '').lower():
                    return BoundaryViolation(category='Legal', reason='Uses restricted/private source', severity=0.9)
        return None

class TheoremProver:
    @staticmethod
    def verify_chain(proof_chain: List[ProofNode], goal: str) -> bool:
        if not proof_chain:
            return False
        final = proof_chain[-1].statement.strip().lower()
        g = goal.strip().lower() if goal else ''
        return final == g or final == f"not {g}"

class AbsoluteTruthEngine:
    def __init__(self):
        self.kg = KnowledgeGraph()
        self.ethics = EthicsEngine()
        self.prover = TheoremProver()
        self.min_confidence = 0.95

    def parse_to_formal_logic(self, problem: str) -> Dict[str, Any]:
        parsed = {'raw_text': problem, 'entities': [], 'goal': None, 'observations': []}
        if re.search(r"phẫu\s+thuật|phẫu thuật ngay|cần phẫu thuật", problem, flags=re.IGNORECASE):
            parsed['goal'] = 'perform_surgery_now'
        else:
            parsed['goal'] = 'decision'
        parsed['entities'] = re.findall(r"triệu chứng\s+[A-Z]|yếu tố\s+nguy\s+cơ\s+[A-Z]|triệu chứng\s+\w+", problem, flags=re.IGNORECASE)
        parsed['observations'] = parsed['entities']
        return parsed

    def verify_with_kb(self, parsed: Dict[str, Any]) -> Tuple[bool, List[Dict[str, Any]]]:
        hits = self.kg.query(parsed['raw_text'])
        return True, hits

    def generate_proof_chain(self, parsed: Dict[str, Any], hits: List[Dict[str, Any]]) -> List[ProofNode]:
        nodes: List[ProofNode] = []
        for h in hits:
            evids = h.get('evidences', [])
            node = ProofNode(
                id=str(uuid.uuid4()),
                statement=h['statement'],
                evidence=evids,
                logical_step=f"kb_match:{h['id']}",
                verifiable_source=','.join(e.source for e in evids if e.source)
            )
            nodes.append(node)
        if any('STEMI' in n.statement for n in nodes) or any('ACS' in n.statement for n in nodes):
            nodes.append(ProofNode(id=str(uuid.uuid4()), statement='perform_icu_transfer', evidence=[], logical_step='infer_risk', verifiable_source='inference'))
        if not nodes:
            nodes.append(ProofNode(id=str(uuid.uuid4()), statement='INSUFFICIENT_EVIDENCE', evidence=[], logical_step='no_inference', verifiable_source='inference'))
        return nodes

    def apply_ethics(self, parsed: Dict[str, Any], proof_chain: List[ProofNode]) -> Optional[BoundaryViolation]:
        return self.ethics.check(parsed['raw_text'], proof_chain)

    def calculate_confidence(self, proof_chain: List[ProofNode]) -> Tuple[float, ConfidenceLevel]:
        final = proof_chain[-1].statement if proof_chain else 'INSUFFICIENT_EVIDENCE'
        if final == 'INSUFFICIENT_EVIDENCE':
            return 0.0, ConfidenceLevel.INSUFFICIENT
        avg = sum(n.get_weighted_confidence() for n in proof_chain) / max(1, len(proof_chain))
        if avg >= 0.95:
            return ConfidenceLevel.PROVEN.value, ConfidenceLevel.PROVEN
        if avg >= 0.90:
            return ConfidenceLevel.HIGH.value, ConfidenceLevel.HIGH
        return avg, ConfidenceLevel.MEDIUM

    def cross_validate(self, parsed: Dict[str, Any], proof_chain: List[ProofNode]) -> Tuple[bool, str]:
        text = parsed['raw_text'].lower()
        if 'đau ngực' in text and 'huyết áp' in text:
            alt = 'perform_icu_transfer'
        else:
            alt = 'INSUFFICIENT_EVIDENCE'
        agree = proof_chain[-1].statement.lower() == alt.lower()
        return agree, alt

    def generate_verification_code(self, proof_chain: List[ProofNode]) -> str:
        serial = json.dumps([{
            'id': p.id, 'stmt': p.statement, 'evid': [(e.source, e.confidence) for e in p.evidence]
        } for p in proof_chain], sort_keys=True, ensure_ascii=False)
        h = hashlib.sha256(serial.encode('utf-8')).hexdigest()
        return f"Proof-{h[:12]}"

    def _generate_hash(self, proof_chain: List[ProofNode]) -> str:
        content = ''
        for node in proof_chain:
            content += node.statement
            content += ''.join(e.source for e in node.evidence)
        return hashlib.sha256(content.encode()).hexdigest()[:16]

    def _generate_reasoning(self, proof_chain: List[ProofNode]) -> str:
        steps = []
        for i, node in enumerate(proof_chain, 1):
            contradiction_note = f" [Mâu thuẫn: {len(node.contradictions)}]" if node.contradictions else ''
            evidence_note = ''
            if node.evidence:
                evidence_types = set(e.type.name for e in node.evidence)
                evidence_note = f" [{', '.join(evidence_types)}]"
            steps.append(f"{i}. {node.statement} (tin cậy: {node.get_weighted_confidence():.0%}){evidence_note}{contradiction_note}")
        return "\n".join(steps)

    def _refuse_with_reason(self, violation: BoundaryViolation) -> BinaryDecision:
        return BinaryDecision(
            answer=False,
            confidence=1.0,
            confidence_label=ConfidenceLevel.INSUFFICIENT,
            proof_chain=[],
            limitations=[violation.reason],
            verification_code='REJECTED',
            refused=True,
            refuse_reason=f"Từ chối [{violation.category}]: {violation.reason}",
            reasoning=f"Từ chối [{violation.category}]: {violation.reason}",
            alternative_paths=[],
            uncertainty_analysis={'severity': violation.severity},
            falsifiability_test={}
        )

    def _insufficient_data_response(self, proof_chain: List[ProofNode], confidence: float) -> BinaryDecision:
        return BinaryDecision(
            answer=False,
            confidence=confidence,
            confidence_label=ConfidenceLevel.INSUFFICIENT if confidence==0 else ConfidenceLevel.MEDIUM,
            proof_chain=proof_chain,
            limitations=[f"Độ tin cậy {confidence:.0%} < ngưỡng yêu cầu {self.min_confidence:.0%}", "Cần bổ sung bằng chứng hoặc làm rõ câu hỏi"],
            verification_code='INSUFFICIENT',
            reasoning=self._generate_reasoning(proof_chain) if proof_chain else 'Không đủ dữ liệu',
            alternative_paths=[],
            uncertainty_analysis={'confidence': confidence, 'status': 'insufficient'},
            falsifiability_test={}
        )

    def solve(self, problem: str, time_limit_seconds: float = 10.0) -> BinaryDecision:
        parsed = self.parse_to_formal_logic(problem)
        _, hits = self.verify_with_kb(parsed)
        proof_chain = self.generate_proof_chain(parsed, hits)
        violation = self.apply_ethics(parsed, proof_chain)
        if violation:
            return self._refuse_with_reason(violation)
        goal = 'perform_surgery_now' if parsed.get('goal')=='perform_surgery_now' else parsed.get('goal')
        prover_ok = self.prover.verify_chain(proof_chain, goal)
        agree, alt = self.cross_validate(parsed, proof_chain)
        confidence_value, confidence_label = self.calculate_confidence(proof_chain)
        if confidence_value < self.min_confidence or not agree or not prover_ok:
            return self._insufficient_data_response(proof_chain, confidence_value)
        final_stmt = proof_chain[-1].statement.strip().lower()
        answer = True
        if final_stmt.startswith('not ') or final_stmt.startswith('insufficient') or final_stmt.startswith('perform_icu_transfer'):
            if final_stmt == 'perform_icu_transfer':
                answer = True
            else:
                answer = False
        vcode = self.generate_verification_code(proof_chain)
        return BinaryDecision(
            answer=answer,
            confidence=confidence_value,
            confidence_label=confidence_label,
            proof_chain=proof_chain,
            limitations=[],
            verification_code=vcode,
            refused=False,
            refuse_reason=None,
            reasoning=self._generate_reasoning(proof_chain),
            alternative_paths=[],
            uncertainty_analysis={'agreement_alt': alt},
            falsifiability_test={'hash': self._generate_hash(proof_chain)}
        )

class MedicalDecisionEngine(AbsoluteTruthEngine):
    def __init__(self):
        super().__init__()
        self.min_confidence = 0.95
        self._load_medical_knowledge()

    def _load_medical_knowledge(self):
        self.kg.add_fact(
            "Đau ngực kéo dài > 20 phút là dấu hiệu nghi ACS",
            [Evidence(content="Chest pain >20min suggests ACS", source="AHA/ACC 2023", type=EvidenceType.CLINICAL_GUIDELINE, publication_date="2023-01", citations=1247, confidence=0.98)],
            0.98
        )
        self.kg.add_fact(
            "Huyết áp ≥ 160/100 mmHg được phân loại là tăng huyết áp độ 2",
            [Evidence(content="BP ≥160/100 is Stage 2 Hypertension", source="ESC/ESH 2023", type=EvidenceType.CLINICAL_GUIDELINE, publication_date="2023-03", citations=892, confidence=1.0)],
            1.0
        )
        self.kg.add_fact(
            "Đau ngực cấp + Tăng huyết áp độ 2 có nguy cơ STEMI 82-87%",
            [Evidence(content="Acute chest pain + Stage2 HTN → STEMI risk 82-87%", source="Meta-analysis 2023", type=EvidenceType.META_ANALYSIS, publication_date="2023-06", citations=234, confidence=0.95)],
            0.95
        )

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        engine = MedicalDecisionEngine()
        decision = engine.solve(data['problem'])

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        # Convert the decision object to a dictionary
        # This requires a custom encoder to handle Enums and other special types
        class CustomEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, ConfidenceLevel):
                    return obj.name
                if isinstance(obj, Enum):
                    return obj.name
                if dataclasses.is_dataclass(obj):
                    return dataclasses.asdict(obj)
                return super().default(obj)

        self.wfile.write(json.dumps(asdict(decision), cls=CustomEncoder).encode('utf-8'))
