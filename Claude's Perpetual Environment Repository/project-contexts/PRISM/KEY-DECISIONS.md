# PRISM - Key Decisions Log

> **Purpose**: Record significant decisions with rationale. Prevents re-litigating settled questions.

**Last Updated**: December 29, 2025

---

## Decision Log

### December 29, 2025

#### Decision: Target Customer is CFO's Office, NOT Compliance

**Context**: Needed to clarify who the buyer and user is.

**Decision**: Target the CFO's office (Finance Director, Head of Finance) not the Compliance department.

**Rationale**:
- ICARA/MiFIDPRU is prudential capital regulation, not compliance tick-boxing
- Compliance lacks the skill to execute ICARA - it's a finance/risk exercise
- Compliance's only touchpoint is ensuring the process is done, not doing it
- Budget authority and pain sits with CFO

**Implications**:
- UX designed for finance professionals, not compliance officers
- Messaging focuses on capital, risk, operational value
- Sales approach targets CFOs and Finance Directors

---

#### Decision: V1 = Complete ICARA Process, Nothing More

**Context**: Needed to define MVP scope precisely.

**Decision**: V1 includes:
- All regulatory calculators working and integrated
- Linear AND Reverse stress testing (as per regulations)
- ICARA document generation with PDF export
- Living operational system capability

V1 excludes:
- FCA RegData integration
- Real-time trading system APIs
- Cross-firm benchmarking
- Mobile app

**Rationale**:
- The regulation defines what's required - build exactly that
- Don't over-engineer before market validation
- First mover advantage requires speed
- Benchmarking requires data accumulation (comes later)

**Implications**:
- Focus development on core ICARA requirements
- Stress testing is mandatory for V1 (not a future feature)
- OFAR integration is the critical path

---

#### Decision: Two-Tier Strategy (Trojan Horse + Data Moat)

**Context**: How to build defensible value, not just a replicable calculator.

**Decision**:
- Tier 1: Regulatory compliance functionality (the door opener)
- Tier 2: Proprietary data platform (the real value)

**Rationale**:
- If we just build calculators, competitors can replicate
- Value trends to zero as formulas get copied
- The data accumulated from thousands of firms is irreplicable
- Network effects: more firms = more valuable data = more firms

**Implications**:
- Architecture must support data accumulation from day 1
- Historical versioning is critical (already implemented)
- Anonymised aggregation capability needed in V2
- Exit story is about data asset, not just software

---

#### Decision: SaaS Delivery, £99/user, Minimum 3 Seats

**Context**: Needed to determine delivery and pricing model.

**Decision**:
- SaaS (cloud-hosted, subscription)
- £99/user/month initial price point
- Minimum 3 seats (admin, SMF owner, key contributors)
- Price elasticity upward as value proves out

**Rationale**:
- SaaS enables data aggregation across firms
- Per-user pricing scales with firm size
- 3 seats ensures proper multi-stakeholder usage
- "Rather have customers clamouring than delivering shit that doesn't work"

**Implications**:
- Multi-tenancy architecture (organizationId isolation)
- User management and RBAC essential
- Subscription billing infrastructure needed
- Quality-first, not volume-first

---

#### Decision: Documentation Before Development

**Context**: Project had technical docs but no commercial context.

**Decision**: Pause development to establish complete commercial context and strategic documentation.

**Rationale**:
- Can't build right without knowing WHY
- Integration phase requires clear vision of the end state
- Documentation prevents re-discovery in future sessions
- "Surgical precision" requires clear targets

**Implications**:
- Created STRATEGIC and REGULATORY folders
- COMMERCIAL-CONTEXT.md as authoritative source
- V1-SHIP-SPECIFICATION.md as concrete checklist
- All future sessions can reference this context

---

## How to Use This Document

**Before making a new decision**:
1. Check if it's already decided here
2. If decided, follow the decision unless there's new information
3. If new information warrants revisiting, document the change

**When adding a new decision**:
1. State the context clearly
2. State the decision explicitly
3. Explain the rationale
4. Note the implications

---

**Keep this document updated with all significant decisions.**
