// Mock data for development and demo purposes

export const mockCouncilResponses = {
  members: [
    {
      id: 'gpt-5.3',
      name: 'GPT-5.3',
      provider: 'OpenAI Flagship',
      confidence: 87,
      summary: 'Based on comprehensive analysis, I recommend a microservices architecture with containerization for optimal scalability and maintainability.',
      reasoning: `**Key Analysis Points:**

1. **Scalability Requirements**: The high-traffic nature of the platform demands horizontal scaling capabilities. Microservices allow independent scaling of components based on demand.

2. **Technology Stack**: 
   - Backend: Node.js with TypeScript for API services
   - Database: PostgreSQL for transactional data, Redis for caching
   - Message Queue: RabbitMQ for async processing

3. **Deployment Strategy**: Kubernetes orchestration provides self-healing and auto-scaling capabilities.

4. **Cost Considerations**: Initial setup cost is higher but long-term operational costs are reduced through efficient resource utilization.

**Risk Assessment**: Medium complexity in implementation, but well-documented patterns exist.`,
      color: '#10B981'
    },
    {
      id: 'claude-opus',
      name: 'Claude Opus 4.6',
      provider: 'Anthropic Flagship',
      confidence: 92,
      summary: 'I strongly advocate for a modular monolith approach initially, with clear domain boundaries that allow future microservices extraction.',
      reasoning: `**Detailed Reasoning:**

1. **Evolutionary Architecture**: Starting with a modular monolith reduces initial complexity while maintaining future flexibility. Clear module boundaries enable gradual decomposition.

2. **Development Velocity**: Teams can ship features faster without distributed systems overhead. This is crucial for early-stage platforms needing rapid iteration.

3. **Operational Simplicity**:
   - Single deployment unit initially
   - Simpler debugging and tracing
   - Lower DevOps expertise required

4. **Database Design**: Event sourcing with CQRS pattern provides audit trails and enables future service extraction.

5. **When to Split**: Define clear metrics (request volume, team size, feature complexity) that trigger microservices extraction.

**Confidence Basis**: This approach has proven successful in similar scenarios at companies like Shopify and Segment.`,
      color: '#8B5CF6'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini 3 Pro',
      provider: 'Google Flagship',
      confidence: 78,
      summary: 'Consider a serverless-first architecture using cloud functions and managed services to minimize operational overhead.',
      reasoning: `**Analysis Framework:**

1. **Serverless Benefits**:
   - Pay-per-use pricing model
   - Automatic scaling to zero
   - Reduced operational burden
   - Faster time to market

2. **Architecture Components**:
   - API Gateway for request routing
   - Lambda/Cloud Functions for compute
   - DynamoDB/Firestore for data
   - S3/Cloud Storage for assets

3. **Limitations to Consider**:
   - Cold start latency (mitigated with provisioned concurrency)
   - Vendor lock-in concerns
   - Complex debugging in distributed functions

4. **Hybrid Approach**: Critical high-throughput paths could use containers while auxiliary services remain serverless.

**Uncertainty Note**: Success heavily depends on traffic patterns. Consistent high traffic may make traditional infrastructure more cost-effective.`,
      color: '#3B82F6'
    }
  ],
  chairman: {
    name: 'Chairman',
    model: 'Claude Opus 4.6',
    finalDecision: `After synthesizing inputs from all council members, I present the following recommendation:

## Final Recommendation: Modular Monolith with Serverless Extensions

### Consensus Points ✅
- All members agree on the need for **scalability** and **maintainability**
- Clear **domain boundaries** are essential regardless of architecture
- **Caching strategy** (Redis) is universally recommended
- **Event-driven patterns** provide flexibility for future evolution

### Key Disagreements Addressed 🔄
- **GPT-5.3** favors immediate microservices, but this adds complexity prematurely
- **Gemini 3 Pro's** serverless approach is valuable for auxiliary functions, not core services
- **Claude Opus 4.6's** modular monolith provides the best balance

### Synthesized Architecture:
1. **Core Platform**: Modular monolith with clear bounded contexts
2. **Auxiliary Services**: Serverless functions for notifications, analytics, image processing
3. **Data Layer**: PostgreSQL with read replicas, Redis caching, event store
4. **Future Path**: Define metrics for when to extract services (>10k RPS per module)

### Implementation Priority:
1. Domain modeling and bounded context definition
2. Core e-commerce monolith with modules
3. Serverless auxiliary services
4. Performance monitoring and extraction criteria

**Confidence Level**: 89% - This approach balances immediate delivery needs with long-term scalability.`,
    consensusScore: 89,
    agreements: ['Scalability is critical', 'Caching layer needed', 'Event-driven patterns'],
    disagreements: ['Initial architecture complexity', 'Serverless vs containers for core services']
  }
};

export const mockDxOResponses = {
  leadResearcher: {
    role: 'Lead Researcher',
    icon: '🔬',
    focus: 'Primary analysis and synthesis',
    content: `## Initial Research Analysis

### Problem Statement
Evaluating the optimal database architecture for a high-traffic e-commerce platform requiring real-time inventory management, order processing, and analytics.

### Initial Recommendation
A **polyglot persistence** approach using:

1. **Primary Transactional Store**: PostgreSQL
   - ACID compliance for orders and payments
   - Strong consistency guarantees
   - Mature ecosystem and tooling

2. **Real-time Inventory**: Redis Cluster
   - Sub-millisecond latency
   - Atomic operations for stock management
   - Pub/sub for inventory updates

3. **Search & Catalog**: Elasticsearch
   - Full-text product search
   - Faceted navigation
   - Near real-time indexing

4. **Analytics Warehouse**: ClickHouse
   - Columnar storage for analytics
   - Fast aggregations on large datasets

### Key Assumptions
- Expected 10,000+ concurrent users
- 99.99% uptime requirement
- Sub-100ms response time for catalog queries`,
    color: '#8B5CF6'
  },
  criticalReviewer: {
    role: 'Critical Reviewer',
    icon: '🔍',
    focus: 'Identify gaps and weaknesses',
    content: `## Critical Review of Lead's Proposal

### Identified Gaps ⚠️

1. **Operational Complexity**
   - Four different database technologies require diverse expertise
   - Increased monitoring and maintenance burden
   - Higher risk of configuration drift

2. **Data Consistency Challenges**
   - Cross-database transactions not addressed
   - Eventual consistency between systems may cause inventory overselling
   - No clear strategy for handling partial failures

3. **Cost Analysis Missing**
   - No TCO comparison with simpler alternatives
   - Redis Cluster licensing costs not considered
   - Elasticsearch operational costs can escalate quickly

### Questions Requiring Answers
- What's the fallback if Redis becomes unavailable?
- How are database schema migrations coordinated?
- What's the data synchronization lag tolerance?

### Alternative Consideration
Has a **single-database approach** with PostgreSQL + extensions (pg_search, timescaledb) been evaluated? It could reduce complexity significantly.

### Risk Rating: MEDIUM-HIGH
The proposal is technically sound but operationally complex.`,
    color: '#EF4444'
  },
  domainExpert: {
    role: 'Domain Expert',
    icon: '📚',
    focus: 'Deep domain knowledge',
    content: `## Domain Expertise Input

### E-Commerce Database Patterns

Based on industry best practices and case studies:

1. **Amazon's Approach**
   - Started with Oracle, migrated to purpose-built databases
   - DynamoDB for cart, Aurora for orders
   - Lesson: Start simpler, evolve based on actual bottlenecks

2. **Shopify's Evolution**
   - MySQL with heavy sharding
   - Moved to Vitess for horizontal scaling
   - Key insight: Operational simplicity initially, complexity when needed

3. **Inventory Management Specifics**
   - Two-phase reservation pattern prevents overselling
   - Saga pattern for distributed transactions
   - CDC (Change Data Capture) for cross-system sync

### Recommended Data Sources
- **Benchmark data**: TPC-C for transactional, TPC-H for analytics
- **Case studies**: High Scalability blog, AWS re:Invent talks
- **Standards**: Payment Card Industry (PCI) compliance requirements

### Domain-Specific Constraints
- PCI-DSS requires encryption at rest and in transit
- GDPR considerations for EU customers
- Real-time inventory must handle flash sales (10x normal traffic)`,
    color: '#3B82F6'
  },
  dataAnalyst: {
    role: 'Data Analyst',
    icon: '📊',
    focus: 'Quantitative reasoning',
    content: `## Quantitative Analysis

### Performance Projections

| Metric | PostgreSQL Only | Polyglot (Proposed) |
|--------|----------------|---------------------|
| Avg Latency | 45ms | 12ms |
| P99 Latency | 250ms | 85ms |
| Write Throughput | 5,000 TPS | 15,000 TPS |
| Query Complexity | High | Distributed |

### Cost Analysis (Monthly, 10K concurrent users)

| Component | PostgreSQL + Extensions | Polyglot |
|-----------|------------------------|----------|
| Database | $2,500 | $1,800 |
| Cache (Redis) | $0 (built-in) | $800 |
| Search | $400 (pg_search) | $1,200 |
| Analytics | $600 (TimescaleDB) | $900 |
| **Total** | **$3,500** | **$4,700** |
| DevOps Overhead | Low | High (+$3K/mo est.) |

### Statistical Confidence
- Performance data: 85% confidence (based on benchmarks)
- Cost estimates: 90% confidence (AWS pricing)
- Traffic projections: 70% confidence (early-stage estimate)

### Recommendation from Data
The polyglot approach offers better performance but ~35% higher TCO when including operational overhead. Break-even point is approximately 50K concurrent users.`,
    color: '#10B981'
  },
  finalDecision: {
    role: 'Final Decision',
    icon: '✨',
    title: 'Synthesized Recommendation',
    content: `## Final Decision: Phased Polyglot Approach

### Addressing Review Concerns ✅

1. **Complexity Concern** → Start with PostgreSQL-first, add components based on measured bottlenecks
2. **Consistency Concern** → Implement Saga pattern with compensation transactions
3. **Cost Concern** → Phase rollout to match actual scale needs

### Revised Architecture

**Phase 1 (Launch - 6 months)**
- PostgreSQL with pg_search and TimescaleDB extensions
- Application-level caching
- Estimated TCO: $3,500/month

**Phase 2 (Growth - 6-18 months)**
- Add Redis for session and inventory caching
- Trigger: >5,000 concurrent users consistently
- Estimated TCO: $4,300/month

**Phase 3 (Scale - 18+ months)**
- Migrate search to Elasticsearch
- Dedicated analytics cluster
- Trigger: Search latency >200ms or analytics impacting OLTP
- Estimated TCO: $5,500/month

### Key Changes from Initial Proposal
| Original | Revised | Reason |
|----------|---------|--------|
| All DBs at launch | Phased rollout | Reduce initial complexity |
| Redis Cluster | Redis Sentinel first | Cost optimization |
| ClickHouse | TimescaleDB → ClickHouse | Start with PostgreSQL ecosystem |

### Success Metrics
- P99 latency <100ms
- Zero inventory oversells
- <2 hours MTTR for any database issue

### Confidence Level: 91%
This approach balances the Lead's technical vision with the Reviewer's operational concerns and the Analyst's cost data.`,
    color: '#F59E0B',
    revisions: [
      { from: 'Immediate polyglot', to: 'Phased approach', reason: 'Reviewer complexity concern' },
      { from: 'Redis Cluster', to: 'Redis Sentinel → Cluster', reason: 'Analyst cost data' },
      { from: 'ClickHouse immediate', to: 'TimescaleDB first', reason: 'Expert pattern: start simple' }
    ]
  }
};

// Function to add simulated delay for realistic demo feel
export const simulateDelay = (ms = 1500) => new Promise(resolve => setTimeout(resolve, ms));
