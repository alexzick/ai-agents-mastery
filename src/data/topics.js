// ─── FULL CURRICULUM: 67 Topics across 9 phases ─────────────────────────────
// Phase 0: LLM Foundations · Phase 1: Agent Foundations · Phase 2: Context & Memory
// Phase 3: Retrieval · Phase 4: Architecture · Phase 5: Production
// Phase 6: Orchestration · Phase 7: Claude API · Phase 8: Study System

const TOPICS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 0 — LLM FOUNDATIONS (6 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "what-is-an-llm",
    category: "Foundations",
    order: 1,
    title: "What is an LLM?",
    prereqs: [],
    core: "A large language model (LLM) is a neural network trained to predict the next token in a sequence, and many useful capabilities emerge from that objective at scale.",
    analogy:
      "Think of an LLM like an impossibly advanced autocomplete trained on a huge portion of human writing. It does not begin with truth lookup — it begins with pattern prediction.",
    details: `
**At its core**, an LLM takes in tokens and predicts what token should come next given the prior context.

**Why this becomes powerful:**
- Language contains facts, logic, plans, code, and style
- Predicting well requires compressing many patterns from the world
- At enough scale, this produces summarization, translation, coding, and reasoning-like behavior

**Important caveats:**
- An LLM is **not** a database — it does not store or retrieve facts reliably
- It is not inherently grounded in truth
- It is a statistical model over token sequences
- Confidence in tone ≠ confidence in truth

**Key insight for agent builders:** Since the model is a pattern-completion engine, not a truth engine, agents must supply grounding through tools, retrieval, and verification.
    `,
    flashQ: "What is an LLM at its core, and why is this important for agent builders?",
    flashA:
      "A neural network trained to predict the next token. This matters because it means agents must supply grounding — the model generates plausible text, not guaranteed truth.",
    feynman:
      "Explain how next-token prediction can still produce coding and reasoning. Then contrast an LLM with a database. Finally, explain why this matters when building agents.",
  },
  {
    id: "tokens-embeddings-attention",
    category: "Foundations",
    order: 2,
    title: "Tokens, Embeddings, and Attention",
    prereqs: ["what-is-an-llm"],
    core: "LLMs operate on tokens, represent them as vectors called embeddings, and use attention to decide which parts of the context matter when generating output.",
    analogy:
      "Tokens are the puzzle pieces, embeddings are their coordinates in meaning-space, and attention is the spotlight deciding what matters right now.",
    details: `
**Tokens:**
- Words, subwords, punctuation, code fragments
- Cost and context limits are measured in tokens
- "ChatGPT" might be 1-3 tokens depending on the tokenizer

**Embeddings:**
- Vector representations in high-dimensional space
- Similar meanings cluster together ("king" is near "queen")
- This is why semantic search works

**Attention:**
- Lets the model weight prior tokens differently for each prediction
- Explains why prompt order and context salience matter
- "Lost-in-the-middle" happens when attention spreads too thin over long contexts

**Why this matters for agents:** Token count determines cost and context limits. Attention determines what information the model actually uses. Bad context packing = wasted tokens and poor attention.
    `,
    flashQ: "Why does changing prompt order sometimes change output quality?",
    flashA:
      "Because the attention mechanism weights tokens differently based on position. Information at the beginning and end tends to be weighted more heavily than content buried in the middle.",
    feynman:
      "Explain embeddings without using math. Then explain why token count matters for both cost and quality. Finally, explain why prompt order affects agent behavior.",
  },
  {
    id: "probabilistic-models",
    category: "Foundations",
    order: 3,
    title: "Probabilistic Models and Their Limits",
    prereqs: ["what-is-an-llm"],
    core: "LLMs are probabilistic models: they estimate likelihoods over possible next tokens rather than retrieving certainty.",
    analogy:
      "They are less like calculators and more like elite improvisers — choosing the most plausible continuation, not the provably correct one.",
    details: `
**Key implications:**
- Multiple outputs may be plausible for the same input
- Small prompt changes can cascade into very different answers
- Confidence in tone does **not** equal certainty in truth
- Temperature controls randomness but doesn't create determinism

**Why it matters for agents:**
- Determinism must be **engineered** (structured outputs, verification steps)
- Verification must often be **externalized** (tests, search, human review)
- The same agent prompt can produce different action sequences across runs
- Production systems must handle variance, not just optimize for the best case

**Common mistake:** Treating LLM outputs like database queries — expecting the same input to always produce the same output.
    `,
    flashQ: "A team builds an agent that works perfectly in 3 test runs, then fails in production. What fundamental property of LLMs explains this?",
    flashA:
      "LLMs are probabilistic — they sample from a distribution of plausible outputs. 3 test runs don't cover the variance space. Production needs verification and error handling for the full distribution.",
    feynman:
      "Explain why a probabilistic model can still be useful. Then contrast a calculator and an LLM. Finally, explain why confident tone is not evidence of truth.",
  },
  {
    id: "training-vs-inference",
    category: "Foundations",
    order: 4,
    title: "Training vs Inference",
    prereqs: ["what-is-an-llm"],
    core: "Training updates model weights from data; inference uses fixed weights plus your prompt to generate output.",
    analogy:
      "Training is school. Inference is taking the test with what is already in your head plus whatever notes you are allowed to bring.",
    details: `
**Training:**
- Updates parameters (weights) based on data
- Expensive, compute-heavy, done by model providers
- Happens once (or periodically with fine-tuning)

**Inference:**
- No weight updates — model is frozen
- Uses the prompt + context as the only variable input
- Most application development happens here

**The critical distinction for builders:**
- **Prompting** changes the input → changes behavior at inference
- **RAG** changes runtime evidence → injects knowledge at inference
- **Fine-tuning** changes the model → updates weights during training

**Common confusion:** "We uploaded documents so the model is trained on them." No — uploading docs is retrieval (inference-time), not training.
    `,
    flashQ: "A client says 'we trained the model on our docs by uploading them.' What's wrong with this statement?",
    flashA:
      "Uploading documents is retrieval-augmented generation (RAG) — it happens at inference time. Training means updating model weights, which is a separate, expensive process.",
    feynman:
      "Explain why uploading a PDF is not training. Then contrast prompting, RAG, and fine-tuning. Finally, explain why teams confuse these terms.",
  },
  {
    id: "training-stages",
    category: "Foundations",
    order: 5,
    title: "Pretraining, Instruction Tuning, Fine-Tuning & Alignment",
    prereqs: ["training-vs-inference"],
    core: "Modern LLMs are shaped in stages: pretraining builds broad capability, instruction tuning teaches task-following, fine-tuning specializes behavior, and preference alignment nudges outputs toward preferred responses.",
    analogy:
      "Pretraining is general education, instruction tuning is job training, fine-tuning is specialization, and alignment is learning professional judgment.",
    details: `
**The stages:**
1. **Pretraining**: Massive next-token prediction on internet-scale data → broad capability
2. **Instruction tuning**: Training on instruction/response pairs → follows directions
3. **Fine-tuning**: Additional training on domain-specific data → specialized behavior
4. **Preference alignment** (RLHF/DPO): Nudges toward human-preferred outputs → safety, helpfulness

**Decision framework (I-K-B mnemonic):**
- **Instructions** (prompting): Change what the model does via system/user prompts
- **Knowledge** (RAG): Supply runtime evidence the model doesn't have
- **Behavior** (fine-tuning): Change the model's default behavior distribution

**Rule of thumb:** Try prompting first → add RAG for knowledge → fine-tune only for repeated behavioral specialization that prompting can't achieve.
    `,
    flashQ: "When should you fine-tune vs use RAG? Give a case where each is the right choice.",
    flashA:
      "Fine-tune for repeated behavior/style specialization (e.g., always respond in a specific medical format). Use RAG for dynamic knowledge (e.g., answering from latest internal docs that change weekly).",
    feynman:
      "Explain why fine-tuning is usually wrong for 'latest documents.' Then contrast instruction tuning and fine-tuning. Finally, give a case where fine-tuning is the right call.",
  },
  {
    id: "hallucination",
    category: "Foundations",
    order: 6,
    title: "Hallucination — What It Actually Is",
    prereqs: ["probabilistic-models"],
    core: "Hallucination is when the model produces plausible-looking content that is not sufficiently grounded in truth, evidence, or source data.",
    analogy:
      "Like a polished student writing a confident essay despite not knowing the answer — the writing quality masks the knowledge gap.",
    details: `
**Types of hallucination:**
- **Factual**: States incorrect facts confidently
- **Tool hallucination**: Invents tool names, arguments, or results
- **Attribution**: Cites sources that don't exist or don't say what's claimed
- **Reasoning**: Reaches wrong conclusions through plausible-looking logic

**Root causes:**
- Pattern-completion pressure (must generate *something*)
- Missing evidence in context
- Ambiguous prompts that don't constrain the answer space
- Strong language priors overriding weak evidence

**Defense strategies (G-R-A-C-E):**
- **Ground**: Supply evidence in context
- **Retrieve**: Use RAG to inject real data
- **Anchor**: Constrain outputs to evidence
- **Constrain**: Use structured outputs and schemas
- **Evaluate**: Verify outputs against sources

**Why this is critical for agents:** Agents take *actions* based on model output. A hallucinated tool call doesn't just give a wrong answer — it executes a wrong action.
    `,
    flashQ: "Why is hallucination more dangerous in an agent than in a chatbot?",
    flashA:
      "Because agents take actions based on model output. A hallucinated tool call doesn't just give a wrong answer — it executes a wrong action in the real world (deleting files, sending emails, making API calls).",
    feynman:
      "Explain why hallucination is not simply lying. Then contrast hallucination and randomness. Finally, explain why articulate wrong answers are dangerous in agents.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1 — AGENT FOUNDATIONS (6 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "what-is-agent",
    category: "Foundations",
    order: 7,
    title: "What is an AI Agent?",
    prereqs: ["what-is-an-llm"],
    core: "An AI agent is an LLM-based system that can perceive inputs, reason, act with tools, maintain state, and pursue a goal across multiple steps.",
    analogy:
      "A regular LLM is a genius locked in a room who can only pass notes. An agent gives that genius a phone, browser, tools, and a checklist.",
    details: `
**Key properties (P-R-A-M-G):**
- **Perception**: Receives inputs (text, images, tool results, memory)
- **Reasoning**: Uses an LLM to plan and decide (often via chain-of-thought)
- **Action**: Executes tools, calls APIs, writes files, spawns sub-agents
- **Memory**: Tracks state across steps (in-context, external DB, or embeddings)
- **Goal-orientation**: Pursues an objective across multiple steps without constant human input

**Non-agent vs Agent:**
- Non-agent: "Summarize this email" → Single LLM call, no actions
- Agent: "Handle my inbox" → Reads emails, drafts replies, schedules meetings, flags urgent items

**The spectrum of agency:**
1. Simple prompt/response (no agency)
2. Prompt chaining (low agency)
3. Router + tool use (medium agency)
4. Autonomous agent with memory (high agency)
5. Multi-agent orchestration (maximum agency)
    `,
    flashQ: "What are the 5 key properties that define an AI agent? (Use the mnemonic)",
    flashA:
      "P-R-A-M-G: Perception, Reasoning, Action, Memory, Goal-orientation.",
    feynman:
      "Explain an AI agent to a 10-year-old using only real-world analogies. Then contrast an agent with a chatbot. Finally, explain why tools and memory change the game.",
  },
  {
    id: "tools",
    category: "Foundations",
    order: 8,
    title: "Tools: The Agent's Hands",
    prereqs: ["what-is-agent"],
    core: "Tools are functions the agent can call to interact with the outside world. Without tools, an agent is mostly just a chatbot with a plan.",
    analogy:
      "If the LLM is a brain, tools are the hands, eyes, and voice. A brain with no body can think but can't do.",
    details: `
**Tool types:**
- **Read tools**: web_search, read_file, query_database, fetch_url
- **Write tools**: write_file, send_email, create_calendar_event
- **Execute tools**: run_python, bash, call_api, deploy_code
- **Agent tools**: spawn_subagent, delegate_task

**How tools work in Claude:**
\`\`\`json
{
  "name": "web_search",
  "description": "Search the web for current information",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {"type": "string", "description": "Search query"}
    },
    "required": ["query"]
  }
}
\`\`\`
Claude outputs a \`tool_use\` block → your code runs the tool → you send a \`tool_result\` back → Claude continues reasoning.

**Tool design principles:**
- Clear, specific descriptions (the LLM reads these!)
- Narrow scope per tool (do one thing well)
- Return structured, parseable results
- Include error states in the schema
    `,
    flashQ:
      "What does Claude output when it wants to use a tool, and what must you send back?",
    flashA:
      "Claude outputs a `tool_use` block. You run the tool and send back a `tool_result` message.",
    feynman:
      "Explain how tools work in Claude's API as if explaining to a junior developer. Then contrast a model-generated answer with a tool result. Finally, explain what goes wrong when tools are vaguely described.",
  },
  {
    id: "prompting-for-agents",
    category: "Foundations",
    order: 9,
    title: "Prompt Engineering for Agents",
    prereqs: ["what-is-agent"],
    core: "Agent prompts define role, constraints, tool rules, output format, and fallback behavior across repeated loops — not just one answer.",
    analogy:
      "A chatbot prompt is a test question. An agent prompt is a job description — it defines expectations, boundaries, and how to handle the unexpected.",
    details: `
**The anatomy of an agent system prompt:**
\`\`\`
You are [ROLE] with [CAPABILITIES].

YOUR GOAL: [Specific, measurable objective]

TOOLS AVAILABLE:
- tool_name: When to use it, what it returns

OPERATING RULES:
1. Always [key behavior]
2. Never [key restriction]
3. When uncertain: [fallback behavior]

OUTPUT FORMAT:
[How to structure final answer]
\`\`\`

**Key differences from chatbot prompting:**
- Must handle **multi-turn loops**, not single responses
- Must define **when to use** each tool (not just what it does)
- Must include **fallback behaviors** for unexpected situations
- Must constrain **stopping conditions** (when is the agent done?)

**Common failure modes:**
- Over-constrained: Agent can't adapt to novel situations
- Under-constrained: Agent wanders, takes unnecessary actions, or never stops
    `,
    flashQ: "What are the 5 key sections of an agent system prompt?",
    flashA:
      "Role/capabilities, Goal, Tools available, Operating rules, Output format.",
    feynman:
      "Write a simple research agent prompt with all 5 sections. Then contrast chatbot prompting with agent prompting. Finally, explain what breaks when prompts are under- or over-constrained.",
  },
  {
    id: "llm-reasoning",
    category: "Foundations",
    order: 10,
    title: "How LLMs Reason (and Fail)",
    prereqs: ["what-is-agent", "probabilistic-models"],
    core: "LLMs reason through token prediction over context; they can be powerful but are vulnerable to hallucination, long-context failures, and false confidence.",
    analogy:
      "A brilliant improviser who sounds confident even when wrong — and has no way to tell you when they're guessing.",
    details: `
**LLM reasoning capabilities:**
- Chain-of-thought reasoning (thinking step by step)
- Pattern matching across vast training data
- Code generation and logical deduction
- Planning and decomposition (with limits)

**Failure modes agents must handle:**
- **Hallucination**: Confident fabrication of facts, citations, or tool arguments
- **Lost-in-the-middle**: Ignoring information buried in long contexts
- **Sycophancy**: Agreeing with the user even when they're wrong
- **Premature commitment**: Locking into an approach without considering alternatives
- **Tool argument hallucination**: Making up plausible but wrong tool inputs

**Mitigation strategies:**
- Structured verification steps after critical actions
- Breaking complex reasoning into smaller validated steps
- Using tools to ground claims in external evidence
- Designing prompts that encourage uncertainty acknowledgment
    `,
    flashQ: "An agent confidently passes the wrong argument to a database tool, corrupting data. Which failure mode is this?",
    flashA:
      "Tool argument hallucination — the model generated plausible but incorrect tool inputs. This is why verification and constrained schemas are critical.",
    feynman:
      "Explain why agents can confidently do the wrong thing. Then contrast reasoning with verification. Finally, describe how you would reduce these failure modes in a production agent.",
  },
  {
    id: "agent-vs-workflow",
    category: "Foundations",
    order: 11,
    title: "Agents vs Workflows vs Chains",
    prereqs: ["what-is-agent", "tools"],
    core: "Chains are fixed sequences, workflows are pre-defined branching logic, and agents are autonomous decision-makers. Use the simplest pattern that works.",
    analogy:
      "A chain is a recipe. A workflow is a flowchart. An agent is a chef who can improvise.",
    details: `
**The complexity spectrum:**
1. **Prompt chain**: Fixed sequence of LLM calls (A → B → C)
2. **Router**: Classifies input, sends to the right handler
3. **Workflow**: Pre-defined branching logic with conditional paths
4. **Agent**: Autonomous loop — decides its own actions dynamically

**The agent tax:**
Every step up in autonomy adds cost:
- Higher token usage (repeated context)
- Higher latency (multiple round-trips)
- Lower predictability (harder to test)
- Harder debugging (non-deterministic paths)

**Decision rule:** Use the **simplest** pattern that solves the problem. Don't use an agent when a workflow will do. Don't use a workflow when a chain suffices.

**When agents earn their tax:**
- Tasks require dynamic tool selection
- Number of steps isn't predictable
- Human would need judgment, not just following steps
    `,
    flashQ: "A team wants to build an agent to generate weekly PDF reports from a fixed template. Why is an agent the wrong choice?",
    flashA:
      "The task is fully specifiable as a fixed chain or workflow — same steps every time, no dynamic decisions. An agent adds cost, latency, and unpredictability for no benefit.",
    feynman:
      "Give an example where an agent is overkill. Then contrast an agent with a workflow. Finally, explain the agent tax and when it's worth paying.",
  },
  {
    id: "when-not-to-use-agent",
    category: "Foundations",
    order: 12,
    title: "When NOT to Use an Agent",
    prereqs: ["agent-vs-workflow", "probabilistic-models"],
    core: "Do not use an agent when the task is simple, fully specifiable, latency-sensitive, or too high-stakes for probabilistic multi-step autonomy.",
    analogy:
      "Do not hire an improv chef when all you need is a toaster.",
    details: `
**Avoid agents when:**
- **One-shot tasks**: Single LLM call suffices (summarize, translate, extract)
- **Fixed workflows**: Steps are always the same and known in advance
- **Strict latency constraints**: Sub-second responses needed
- **Catastrophic mistake domains**: No room for probabilistic error without heavy controls
- **Simple CRUD operations**: A regular API call is cheaper and more reliable

**The agent tax in numbers:**
- 5-20x more tokens than a single call
- 2-10x more latency
- Significantly harder testing and debugging
- Higher operational cost

**Red flags that you're overengineering:**
- You can write the steps as a numbered list
- There are no decisions to make during execution
- The "agent" always takes the same 3 actions
- You're using an agent because it sounds impressive, not because you need autonomy
    `,
    flashQ: "Name 3 red flags that indicate an agent is being overengineered for the task.",
    flashA:
      "You can list the steps in advance, there are no runtime decisions, and the 'agent' always takes the same actions. These are workflows disguised as agents.",
    feynman:
      "Give an overengineered agent example from a real product. Then contrast agent and workflow for a risky process. Finally, explain when rules beat autonomy.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2 — CONTEXT, MEMORY & DELIBERATION (13 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "agentic-loop",
    category: "Context & Memory",
    order: 13,
    title: "The Agentic Loop",
    prereqs: ["tools", "what-is-agent"],
    core: "The agentic loop is the core pattern: reason → act with tool → observe result → reason again, until the goal is reached or the agent stops.",
    analogy:
      "Like a chef tasting and adjusting repeatedly until the dish is done — not a recipe that runs without checking.",
    details: `
**The loop:**
1. Receive goal + context
2. Model reasons (optionally with chain-of-thought)
3. Model emits either a **tool call** or a **final answer**
4. If tool call: your code runs the tool
5. Append \`tool_result\` to messages
6. Go back to step 2

**Two possible outputs per turn:**
- \`stop_reason: "tool_use"\` → Model wants to call a tool → loop continues
- \`stop_reason: "end_turn"\` → Model is done → return final answer

**Critical safeguards:**
- **Max iterations**: Prevent infinite loops (typically 10-25)
- **Token budget**: Stop before context window fills up
- **Timeout**: Wall-clock time limit
- **Stuck detection**: If the model repeats the same action, intervene

\`\`\`python
while iterations < MAX_ITERATIONS:
    response = claude.messages.create(messages=messages, tools=tools)
    if response.stop_reason == "end_turn":
        return response.content
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": [{"type": "tool_result", "tool_use_id": block.id, "content": result}]})
    iterations += 1
\`\`\`
    `,
    flashQ: "What are the two possible outputs from the model on each turn of an agentic loop?",
    flashA:
      "A tool call (stop_reason: tool_use) or a final answer (stop_reason: end_turn).",
    feynman:
      "Narrate one full iteration of the agentic loop. Then contrast a one-shot call with a looped agent. Finally, explain what goes wrong without max iteration limits.",
  },
  {
    id: "memory",
    category: "Context & Memory",
    order: 14,
    title: "Agent Memory Systems",
    prereqs: ["agentic-loop"],
    core: "Agents commonly use working, episodic, external, and semantic memory to operate across steps and sessions (W-E-E-S).",
    analogy:
      "Desk (working), diary (episodic), filing cabinet (external), and associative recall (semantic).",
    details: `
**The 4 memory types (W-E-E-S):**

1. **Working memory**: Current task state held in the conversation context
   - Goal, progress, open questions, next step
   - Lives in the message array during a session

2. **Episodic memory**: Records of past interactions and outcomes
   - "Last time the user asked about X, they preferred Y format"
   - Useful for personalization and learning from failures

3. **External memory**: Stored data outside the context window
   - Databases, vector stores, file systems
   - Retrieved on demand via tools

4. **Semantic memory**: Conceptual knowledge about the domain
   - Embedded in the model's weights (parametric)
   - Or supplied via retrieval (runtime)

**Key insight:** Conversation history alone is NOT memory — it's an append-only log. True working memory requires structured state management.
    `,
    flashQ: "What's the difference between conversation history and working memory?",
    flashA:
      "Conversation history is an append-only log. Working memory is structured state that tracks goal, progress, open questions, and next step — curated and updated, not just accumulated.",
    feynman:
      "Explain why conversation history alone is not enough. Then contrast episodic and semantic memory. Finally, design the memory system for a research agent.",
  },
  {
    id: "parametric-vs-runtime-knowledge",
    category: "Context & Memory",
    order: 15,
    title: "Parametric Knowledge vs Runtime Knowledge",
    prereqs: ["training-vs-inference", "memory"],
    core: "Parametric knowledge lives in model weights (learned during training); runtime knowledge is injected through prompts, retrieval, tools, or memory systems during inference.",
    analogy:
      "What is already in your head vs what is on your desk right now.",
    details: `
**Parametric knowledge:**
- Encoded in model weights during training
- Broad but potentially outdated
- Cannot be easily updated without retraining
- Subject to hallucination when uncertain

**Runtime knowledge:**
- Supplied at inference through context
- Can be current, specific, and verifiable
- Sources: system prompts, RAG, tool results, user messages

**Decision framework:**
- If the knowledge changes frequently → runtime (RAG)
- If the knowledge is domain-specific and proprietary → runtime (RAG)
- If you need a different behavior style → parametric (fine-tuning)
- If the knowledge is general and stable → parametric is often sufficient

**Common mistake:** Assuming the model "knows" your internal docs because they exist on the internet. Parametric knowledge is lossy and unreliable for specifics.
    `,
    flashQ: "A company wants their agent to answer questions about internal policies that change quarterly. Parametric or runtime knowledge?",
    flashA:
      "Runtime knowledge (RAG). Internal policies are proprietary, change frequently, and need to be verifiably current — all signs pointing to retrieval, not reliance on training data.",
    feynman:
      "Explain why internal docs usually belong in runtime systems. Then contrast weights and retrieved context. Finally, explain the tradeoffs of each.",
  },
  {
    id: "memory-vs-knowledge-vs-retrieval",
    category: "Context & Memory",
    order: 16,
    title: "Memory vs Knowledge vs Retrieval",
    prereqs: ["memory", "parametric-vs-runtime-knowledge"],
    core: "Memory stores prior state, knowledge is information the system can use, and retrieval is the process of selecting what knowledge enters context.",
    analogy:
      "Your notebook, your understanding, and flipping to the right page are three different things.",
    details: `
**The distinction:**
- **Memory**: State from prior interactions (what happened before)
- **Knowledge**: Information the system can access (what it can know)
- **Retrieval**: The process of selecting relevant knowledge for the current context (what it actually sees)

**Common confusion:** "We need memory" often hides multiple distinct requirements:
- "The agent should remember user preferences" → Episodic memory
- "The agent should know our product catalog" → Knowledge + retrieval
- "The agent should track what it's already tried" → Working memory
- "The agent should learn from past mistakes" → Episodic memory + feedback loop

**Why this matters:** Mislabeling the requirement leads to building the wrong system. A team that needs retrieval might build a memory system (or vice versa).
    `,
    flashQ: "A PM says 'our agent needs memory.' Give 3 different things this could actually mean.",
    flashA:
      "1) Remembering user preferences (episodic memory), 2) Knowing the product catalog (knowledge + retrieval), 3) Tracking what it already tried this session (working memory). Each requires a different implementation.",
    feynman:
      "Explain why 'we need memory' is too vague to act on. Then contrast memory, knowledge, and retrieval. Finally, give 3 product needs that get mislabeled as memory.",
  },
  {
    id: "context-management",
    category: "Context & Memory",
    order: 17,
    title: "Context Window Management",
    prereqs: ["agentic-loop", "memory"],
    core: "Agent loops grow context over time, so summarization, pruning, and selective retention are required to maintain quality and cost control.",
    analogy:
      "A whiteboard fills up; you must erase, compress, or move notes elsewhere to keep working.",
    details: `
**The problem:** Each loop iteration adds assistant + tool_result messages. A 10-step agent might accumulate 50K+ tokens of context.

**Strategies:**
- **Sliding window**: Drop oldest messages, keep recent + system prompt
- **Summarize-and-replace**: Compress old messages into a summary
- **Hierarchical context**: System prompt → task summary → recent actions → current step
- **Prompt caching**: Cache stable prefixes to reduce cost (not context size)

**What to keep vs what to drop:**
- Keep: System prompt, current goal, recent tool results, working memory
- Drop: Old tool results, superseded plans, verbose intermediate reasoning
- Summarize: Completed subtask outcomes, earlier search results

**Cost impact:** Input tokens are billed every iteration. A 20K-token system prompt resent across 10 iterations = 200K input tokens. Caching can cut this dramatically.
    `,
    flashQ: "An agent's quality degrades after step 8 of a 15-step task. What's the most likely cause and fix?",
    flashA:
      "Context window is filling up, causing lost-in-the-middle effects. Fix: summarize completed steps, prune old tool results, keep only the current working memory and recent context.",
    feynman:
      "Explain why we can't just keep everything in context forever. Then contrast long context with useful context. Finally, design a summarization policy for a 20-step agent.",
  },
  {
    id: "context-engineering",
    category: "Context & Memory",
    order: 18,
    title: "Context Engineering",
    prereqs: ["context-management", "memory-vs-knowledge-vs-retrieval", "prompting-for-agents"],
    core: "Context engineering is deciding what information enters the model's context, in what form, order, timing, and purpose.",
    analogy:
      "Prompt engineering writes the brief. Context engineering decides what gets into the room.",
    details: `
**Context engineering includes:**
- System prompt design (rules, role, constraints)
- Retrieval strategy (what to fetch, when, from where)
- Memory injection (what past state to include)
- Tool result formatting (how to present evidence)
- Ordering and salience (what goes where in the context)
- Compression (what to summarize or drop)

**The S-T-A-C-K framework:**
- **Select**: Choose what information is relevant
- **Trim**: Remove noise and redundancy
- **Arrange**: Order by importance (critical info near top and bottom)
- **Compress**: Summarize verbose content
- **Keep-updated**: Refresh stale information

**Why this matters more than "clever prompting":** A brilliant prompt with the wrong context produces bad results. A simple prompt with the right context often works surprisingly well.
    `,
    flashQ: "What does S-T-A-C-K stand for in context engineering?",
    flashA:
      "Select, Trim, Arrange, Compress, Keep-updated — the 5 operations for managing what information enters the model's context.",
    feynman:
      "Contrast prompt engineering and context engineering. Then explain why long windows don't remove the need for context engineering. Finally, design the context stack for a research agent.",
  },
  {
    id: "prompt-layers",
    category: "Context & Memory",
    order: 19,
    title: "System Prompt vs User Prompt vs Tool Context",
    prereqs: ["context-engineering", "tools"],
    core: "Different prompt layers do different jobs: system prompt sets rules, user prompt sets the task, and tool context provides grounded observations.",
    analogy:
      "Handbook (system), today's assignment (user), and facts discovered while doing the work (tools).",
    details: `
**The three layers:**
1. **System prompt**: Role, rules, tool definitions, output format, constraints
   - Persistent across the entire conversation
   - Should be stable and cacheable

2. **User prompt**: The current task, question, or goal
   - Changes per interaction
   - Should be specific and actionable

3. **Tool context**: Evidence from tool executions
   - Injected dynamically during the agentic loop
   - Provides grounded, verifiable information

**Design principle:** Each layer should do one job well. Don't put task instructions in the system prompt. Don't put rules in tool results.

**Common failures:**
- Stuffing everything into the system prompt (too long, loses salience)
- Not formatting tool results clearly (model can't extract key info)
- Mixing rules and task in the same prompt section
    `,
    flashQ: "Where should agent rules go vs current task instructions vs external evidence?",
    flashA:
      "Rules → system prompt (persistent). Task → user prompt (per-interaction). Evidence → tool context (dynamic, grounded).",
    feynman:
      "Explain why one giant prompt is bad design. Then contrast what belongs in a system prompt vs retrieval context. Finally, describe what fails when tool outputs are messy.",
  },
  {
    id: "system-prompt-vs-rag-vs-finetuning",
    category: "Context & Memory",
    order: 20,
    title: "System Prompt vs RAG vs Fine-Tuning",
    prereqs: ["training-stages", "context-engineering"],
    core: "System prompts shape behavior, RAG supplies runtime knowledge, and fine-tuning changes the model's behavior distribution itself.",
    analogy:
      "Instructions to an employee (prompt), reference binder on their desk (RAG), training the employee (fine-tuning).",
    details: `
**The I-K-B framework:**
- **I — Instructions** (system prompt): How to behave, what format to use, what rules to follow
- **K — Knowledge** (RAG): What facts, docs, or data to use when answering
- **B — Behavior** (fine-tuning): How the model fundamentally responds

**Decision matrix:**
| Need | Solution | Example |
|------|----------|---------|
| Follow specific rules | System prompt | "Always cite sources" |
| Use current data | RAG | Internal knowledge base |
| Change response style | Fine-tuning | Medical report format |
| Handle edge cases | System prompt + examples | Few-shot prompting |

**Common mistakes:**
- Using fine-tuning for knowledge (expensive, can't update easily)
- Using prompts for large knowledge (context window limits)
- Thinking fine-tuning replaces the need for good prompts (it doesn't)
    `,
    flashQ: "A team wants their agent to answer from a 10,000-page internal knowledge base. System prompt, RAG, or fine-tuning?",
    flashA:
      "RAG. The knowledge is too large for system prompt context, changes over time (ruling out fine-tuning), and needs to be verifiably sourced.",
    feynman:
      "Explain why teams overuse fine-tuning. Then contrast prompt and RAG for customer support. Finally, give a case where fine-tuning is actually the correct choice.",
  },
  {
    id: "working-memory-state",
    category: "Context & Memory",
    order: 21,
    title: "Working Memory and Structured State",
    prereqs: ["memory", "context-engineering"],
    core: "Working memory is the short-lived structured state an agent uses to track goal, progress, open questions, constraints, evidence, and next step.",
    analogy:
      "The scratchpad on the desk — not the whole filing cabinet, just what you need right now.",
    details: `
**Typical working memory schema:**
\`\`\`json
{
  "goal": "Find 3 sources about X and synthesize",
  "completed_steps": ["searched web", "read article 1"],
  "open_questions": ["Is source 2 reliable?"],
  "constraints": ["Must use peer-reviewed sources"],
  "evidence": [{"source": "url1", "key_finding": "..."}],
  "next_step": "Search for peer-reviewed sources"
}
\`\`\`

**Why this matters:**
- Conversation transcript grows linearly → loses structure
- Working memory is **curated** — only relevant state
- Helps the model stay on track across many iterations
- Makes debugging easier (inspect state at any point)

**Implementation:** Pass working memory as a structured block in the system or user prompt. Update it after each loop iteration. The model can update it, or your code can.
    `,
    flashQ: "Why is a conversation transcript not sufficient as working memory?",
    flashA:
      "A transcript is an append-only log that grows linearly. Working memory is curated, structured state — only what's relevant now. Transcripts lose structure, waste tokens, and bury key info.",
    feynman:
      "Explain why transcript ≠ working memory. Then design a working memory schema for a coding agent. Finally, describe what breaks without structured state.",
  },
  {
    id: "context-packing-salience",
    category: "Context & Memory",
    order: 22,
    title: "Context Packing and Salience",
    prereqs: ["context-engineering", "context-management"],
    core: "Context packing is how you assemble the prompt window, and salience is whether important information stays prominent enough to influence behavior.",
    analogy:
      "A suitcase matters less for being full than for having the right items accessible at the top.",
    details: `
**Salience rules:**
- Important instructions near the **top** of the system prompt
- Critical evidence **clearly marked** with headers/labels
- Remove redundancy (duplicate info dilutes attention)
- Use **structure** (sections, headers, bullet points) not walls of text
- Recent information has higher natural salience

**Context packing order:**
1. System prompt (role, rules, tools)
2. Working memory / task summary
3. Retrieved evidence (labeled by source)
4. Recent conversation history
5. Current user message

**Anti-patterns:**
- Dumping 50 retrieved chunks with no labeling
- Putting critical rules at the bottom of a long system prompt
- Including verbose tool results without summarizing
- Repeating the same information in multiple places
    `,
    flashQ: "An agent has all the right information in context but still ignores it. What's the most likely problem?",
    flashA:
      "Poor salience — the information is buried, unlabeled, or surrounded by noise. Fix: put critical info near the top, use clear headers, remove redundancy.",
    feynman:
      "Explain why more context can make outputs worse. Then contrast volume and salience. Finally, design context packing for a mid-task agent run.",
  },
  {
    id: "long-context-limits",
    category: "Context & Memory",
    order: 23,
    title: "Long-Context Limits and Lost-in-the-Middle",
    prereqs: ["context-management", "context-packing-salience"],
    core: "Large context windows help, but buried information can still be ignored or underweighted — a phenomenon called 'lost-in-the-middle.'",
    analogy:
      "A giant whiteboard only helps if the important note is still visible, not buried behind other notes.",
    details: `
**The problem:**
Models attend more strongly to information at the **beginning** and **end** of the context. Content in the middle gets less attention — even with 200K+ token windows.

**Failure modes:**
- **Lost-in-the-middle**: Key info in the middle is underweighted
- **Attention diffusion**: With many items, each gets less attention
- **Noise accumulation**: Irrelevant content drowns out relevant content
- **Cost explosion**: Longer context = more tokens = more money per iteration

**Defenses:**
1. Put critical information at the start and end
2. Summarize and label retrieved content
3. Limit retrieval to the most relevant chunks
4. Use hierarchical context (summary → details on demand)
5. Prune aggressively between iterations
    `,
    flashQ: "Where in a long context window is information most likely to be ignored?",
    flashA:
      "The middle. Models attend more to the beginning and end of the context (lost-in-the-middle effect). Defense: put critical info at the top, summarize and label content.",
    feynman:
      "Explain why a bigger window is not a full solution. Then contrast token capacity and effective context. Finally, give 3 defenses against lost-in-the-middle.",
  },
  {
    id: "planning",
    category: "Context & Memory",
    order: 24,
    title: "Planning & Decomposition",
    prereqs: ["agentic-loop", "llm-reasoning"],
    core: "Complex tasks require decomposition into subtasks before or during execution. The choice between upfront planning and iterative planning depends on how predictable the task is.",
    analogy:
      "A contractor phases the job before hammering — but adjusts the plan as surprises arise.",
    details: `
**Planning strategies:**
1. **Upfront planning**: Generate a full plan before executing any steps
   - Good for: Well-understood tasks with predictable steps
   - Risk: Plan may be wrong, wasting effort

2. **Iterative planning (ReAct-style)**: Plan one step, execute, observe, replan
   - Good for: Exploratory tasks where each step informs the next
   - Risk: Can wander without a clear goal

3. **Hierarchical decomposition**: Break into high-level phases, then detail each
   - Good for: Complex multi-phase projects
   - Risk: Over-planning at the wrong level of detail

**Key insight:** The best agents often combine strategies — make a rough plan upfront, then iterate within each phase.

**Plan verification:** After generating a plan, validate it:
- Are all steps actionable with available tools?
- Are dependencies between steps clear?
- Is there a stopping condition?
- What happens if a step fails?
    `,
    flashQ: "When should an agent plan upfront vs iterate step-by-step?",
    flashA:
      "Plan upfront for well-understood tasks with predictable steps. Iterate for exploratory tasks where each step's result informs the next. Best agents combine both: rough plan upfront, iterate within each phase.",
    feynman:
      "Contrast upfront and iterative planning. Then design a plan for a research-and-write agent. Finally, explain what goes wrong with over-planning.",
  },
  {
    id: "deliberation-patterns",
    category: "Context & Memory",
    order: 25,
    title: "Deliberation Patterns — ReAct, Reflection & Verification",
    prereqs: ["planning", "llm-reasoning", "working-memory-state"],
    core: "ReAct interleaves thought and action, reflection reviews progress, and verification checks whether outputs are actually correct.",
    analogy:
      "Think, do, check — the three phases of careful work.",
    details: `
**ReAct (Reason + Act):**
- Think → Act → Observe → Think → Act → Observe...
- The standard agentic loop with explicit reasoning steps
- Good for: Dynamic tasks where each observation changes the plan

**Reflection:**
- Periodically review: "Am I on track? Should I change approach?"
- Can be prompted: "Before your next action, assess your progress"
- Good for: Preventing sunk-cost continuation of bad approaches

**Verification:**
- Check outputs against evidence, tests, or constraints
- Not just "does this look right?" but "is this provably correct?"
- Examples: Run tests (coding), check citations (research), validate schemas

**Key distinction:** Reflection is self-assessment. Verification is grounded checking against external evidence. Both are necessary — reflection alone is not enough because the model can reflect incorrectly.
    `,
    flashQ: "What's the difference between reflection and verification in an agent?",
    flashA:
      "Reflection is self-assessment ('Am I on track?'). Verification is grounded checking against external evidence (running tests, checking citations). Reflection can be wrong; verification provides real signal.",
    feynman:
      "Contrast reflection and verification. Then explain why reasoning alone is not enough for reliable agents. Finally, design verification steps for both a research and a coding agent.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3 — RETRIEVAL & KNOWLEDGE SYSTEMS (8 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "what-is-rag",
    category: "Retrieval",
    order: 26,
    title: "What is RAG?",
    prereqs: ["tokens-embeddings-attention", "memory-vs-knowledge-vs-retrieval"],
    core: "Retrieval-Augmented Generation retrieves relevant external information at runtime and injects it into context so the model can answer with better grounding.",
    analogy:
      "Open the right book to the right page before answering the question.",
    details: `
**The RAG pipeline (C-E-R-R-A):**
1. **Chunk**: Break documents into retrieval-sized pieces
2. **Embed**: Convert chunks to vectors
3. **Retrieve**: Find chunks most relevant to the query
4. **Rerank**: Score and filter retrieved chunks
5. **Answer**: Generate response grounded in retrieved evidence

**Why RAG matters:**
- Models have knowledge cutoffs (outdated info)
- Models can't access private/proprietary data
- Models hallucinate when they lack evidence
- RAG provides verifiable, citable grounding

**RAG vs other approaches:**
- RAG: Dynamic knowledge, verifiable sources
- Fine-tuning: Behavior change, not knowledge update
- Long context: Works for small datasets, expensive for large ones
    `,
    flashQ: "What does C-E-R-R-A stand for in the RAG pipeline?",
    flashA:
      "Chunk, Embed, Retrieve, Rerank, Answer — the 5 stages of a retrieval-augmented generation pipeline.",
    feynman:
      "Explain why RAG is not training. Then explain why a strong model can still fail with weak retrieval. Finally, describe what RAG solves that prompting alone cannot.",
  },
  {
    id: "vector-rag",
    category: "Retrieval",
    order: 27,
    title: "Vector RAG",
    prereqs: ["what-is-rag", "tokens-embeddings-attention"],
    core: "Vector RAG retrieves semantically similar chunks by comparing query and document embeddings in high-dimensional space.",
    analogy:
      "It matches by meaning, not just exact wording — 'layoffs' finds 'workforce reduction.'",
    details: `
**How it works:**
1. Embed all document chunks into vectors
2. Embed the query into a vector
3. Find chunks with highest cosine similarity to the query
4. Return top-k results

**Strengths:**
- Handles synonyms and paraphrases naturally
- No keyword engineering needed
- Works across languages (with multilingual embeddings)

**Weaknesses:**
- Bad at exact matches (IDs, names, specific numbers)
- Can't follow relationships (A is related to B which connects to C)
- Quality depends heavily on embedding model and chunk size
- Similar ≠ relevant (semantic similarity doesn't guarantee usefulness)
    `,
    flashQ: "A user asks 'What is the PTO policy for employees with 5+ years?' and vector RAG returns chunks about general PTO. Why?",
    flashA:
      "Vector RAG matches by semantic similarity, not exact criteria. 'PTO policy' matches broadly. It can't filter by specific conditions like '5+ years' without additional metadata filtering or structured queries.",
    feynman:
      "Explain why 'layoffs' might find 'workforce reduction' in vector RAG. Then contrast vector and keyword search. Finally, describe what query types vector RAG is bad at.",
  },
  {
    id: "graph-rag",
    category: "Retrieval",
    order: 28,
    title: "Graph RAG",
    prereqs: ["what-is-rag"],
    core: "Graph RAG stores entities and relationships explicitly, enabling retrieval over connected facts rather than only similar text chunks.",
    analogy:
      "Walking a relationship map rather than finding similar paragraphs — you can follow connections.",
    details: `
**How it works:**
1. Extract entities and relationships from documents
2. Store as a knowledge graph (nodes + edges)
3. Query by traversing relationships
4. Return connected subgraphs relevant to the query

**Best for:**
- Relationship-heavy queries ("Who reports to the VP of Engineering?")
- Multi-hop reasoning ("Which products are affected by supplier X's delays?")
- Entity-centric exploration ("Everything related to Project Alpha")

**Limitations:**
- Expensive to build and maintain
- Entity extraction can be noisy
- Overkill for simple semantic matching
- Graph schema design requires domain expertise
    `,
    flashQ: "When does Graph RAG outperform Vector RAG?",
    flashA:
      "For relationship-heavy and multi-hop queries — questions that require traversing connections between entities rather than finding similar text passages.",
    feynman:
      "Explain why Graph RAG can beat vector RAG on relationship questions. Then contrast graph retrieval and chunk retrieval. Finally, give an enterprise use case where Graph RAG shines.",
  },
  {
    id: "hybrid-rag",
    category: "Retrieval",
    order: 29,
    title: "Hybrid RAG",
    prereqs: ["vector-rag", "graph-rag"],
    core: "Hybrid RAG combines multiple retrieval methods — often keyword, vector, graph, and reranking — to improve recall and precision across diverse query types.",
    analogy:
      "A team of detectives, each strong at a different kind of search, collaborating on the case.",
    details: `
**Typical hybrid stack:**
- **Keyword search** (BM25): Exact matches, IDs, specific terms
- **Vector search**: Semantic similarity, paraphrases
- **Graph search**: Relationships, multi-hop queries
- **Reranker**: Scores and ranks combined results

**Why hybrid:**
- No single retrieval method handles all query types well
- Keyword catches what vectors miss (exact terms)
- Vectors catch what keywords miss (synonyms)
- Graphs catch what both miss (relationships)
- Reranking filters noise from the combined results

**Implementation pattern:**
1. Run multiple retrievers in parallel
2. Merge result sets (union or weighted)
3. Rerank merged results
4. Return top-k
    `,
    flashQ: "Why is one retrieval method usually not enough for production RAG?",
    flashA:
      "Different query types need different retrieval strategies. Keywords catch exact terms, vectors catch synonyms, graphs catch relationships. Hybrid combines all three with reranking.",
    feynman:
      "Design a hybrid stack for enterprise support. Then explain why one retriever is usually not enough. Finally, contrast recall and precision in retrieval.",
  },
  {
    id: "chunking-indexing-reranking",
    category: "Retrieval",
    order: 30,
    title: "Chunking, Indexing, and Reranking",
    prereqs: ["what-is-rag"],
    core: "Retrieval quality depends heavily on how documents are chunked, how they're indexed with metadata, and whether results are reranked for relevance.",
    analogy:
      "If you tear a book into random strips, even the best librarian can't help you. Good retrieval starts with good preparation.",
    details: `
**Chunking strategies:**
- **Too small** (1-2 sentences): Loses context, fragments meaning
- **Too large** (full pages): Adds noise, reduces precision
- **Just right** (200-500 tokens): Preserves meaning, manageable size
- **Semantic chunking**: Split at natural boundaries (paragraphs, sections)
- **Overlapping chunks**: Prevent losing context at boundaries

**Indexing:**
- Store metadata alongside chunks (source, date, section, category)
- Metadata enables filtering before semantic search
- Good metadata turns "search everything" into "search the right subset"

**Reranking:**
- First-pass retrieval finds candidates (fast, broad)
- Reranker scores candidates for actual relevance (slower, precise)
- Dramatically improves precision when retrieval returns noisy results
    `,
    flashQ: "A RAG system retrieves relevant-looking chunks but the agent's answers are wrong. What's the first thing to check?",
    flashA:
      "Chunk quality. If chunks are too small (fragmented meaning) or too large (buried relevant info in noise), the model can't extract the right information even from 'relevant' chunks.",
    feynman:
      "Explain why bad chunking can ruin RAG even with a strong model. Then contrast retrieval and reranking. Finally, design chunking strategies for API docs vs meeting notes.",
  },
  {
    id: "agentic-rag",
    category: "Retrieval",
    order: 31,
    title: "Agentic RAG",
    prereqs: ["what-is-rag", "planning"],
    core: "Agentic RAG lets the agent decide when, where, and how to retrieve — rather than doing one fixed retrieval step upfront.",
    analogy:
      "A student who chooses which book to open, reads critically, and looks for a second source when the first one isn't convincing.",
    details: `
**Static RAG vs Agentic RAG:**
- **Static**: Query → Retrieve → Generate. One shot, no adaptation.
- **Agentic**: Agent decides: Should I search? What source? Is this enough? Should I requery?

**Agentic RAG behaviors:**
1. Decide whether retrieval is even needed
2. Choose which source to query
3. Evaluate retrieved results for quality
4. Rewrite query if results are poor
5. Search again with a different strategy
6. Combine evidence from multiple sources
7. Know when to stop searching

**The search-forever failure mode:** Without limits, an agentic RAG system can keep searching indefinitely, never satisfied with results. Defenses: search budget, minimum confidence threshold, max retrieval rounds.
    `,
    flashQ: "What's the key difference between static RAG and agentic RAG?",
    flashA:
      "Static RAG retrieves once upfront. Agentic RAG lets the agent decide when, where, and how to retrieve — and whether to requery, switch sources, or stop.",
    feynman:
      "Explain why one search is often not enough. Then contrast static and agentic RAG. Finally, describe the search-forever failure mode and how to prevent it.",
  },
  {
    id: "query-rewriting",
    category: "Retrieval",
    order: 32,
    title: "Query Rewriting and Retrieval Planning",
    prereqs: ["what-is-rag", "agentic-rag"],
    core: "Good retrieval often requires rewriting the user's question into stronger search queries and planning what evidence is needed before searching.",
    analogy:
      "A good librarian translates your confused question into precise, searchable terms before heading to the stacks.",
    details: `
**Why rewriting matters:**
- User questions are often vague, conversational, or multi-part
- Retrieval systems work best with focused, specific queries
- One broad query often performs worse than several targeted ones

**Retrieval planning asks:**
- What evidence would answer this question?
- Which source should I search first?
- Should I use one broad query or several narrow ones?
- What would a negative result tell me?

**Rewriting techniques:**
- Decompose multi-part questions into individual queries
- Replace pronouns and references with explicit terms
- Generate multiple query variants for diverse retrieval
- Add domain-specific terms the retriever expects
    `,
    flashQ: "A user asks 'How does the new policy affect remote workers in Europe?' Why might you rewrite this into multiple queries?",
    flashA:
      "The question has multiple facets: 1) What is the new policy? 2) How does it affect remote workers? 3) Are there Europe-specific provisions? Separate queries improve retrieval recall for each facet.",
    feynman:
      "Explain why a good human question is not always a good retriever query. Then rewrite a vague query into 3 better ones. Finally, describe what happens if retrieval planning is skipped.",
  },
  {
    id: "rag-evals",
    category: "Retrieval",
    order: 33,
    title: "Evaluation for RAG Systems",
    prereqs: ["what-is-rag"],
    core: "RAG systems must be evaluated in layers: retrieval quality, grounding quality, answer quality, and system efficiency.",
    analogy:
      "A relay race must be judged at the start, each handoff, the final sprint, and the clock — not just who crosses the finish line.",
    details: `
**Evaluation layers:**
1. **Retrieval recall**: Did we find the right chunks?
2. **Retrieval precision**: How much noise did we include?
3. **Grounding**: Did the model use the retrieved evidence (not hallucinate)?
4. **Answer quality**: Is the final answer correct and complete?
5. **Operational metrics**: Latency, cost, token usage

**Why each layer matters:**
- High answer quality with low retrieval recall = lucky, not reliable
- High retrieval recall with poor grounding = model ignoring evidence
- Good grounding with wrong retrieval = confidently citing the wrong source

**Practical eval setup:**
- Create 20-50 test questions with known answers
- For each: check retrieval, check grounding, check answer
- Track metrics over time as you change chunking, prompts, or models
    `,
    flashQ: "A RAG system gives correct answers to 80% of test questions. Is it production-ready? What's missing from this evaluation?",
    flashA:
      "Not enough information. You need to know: Is the 80% from good retrieval + grounding, or lucky hallucination? Are the 20% failures from bad retrieval, bad grounding, or bad generation? Layer-by-layer eval is needed.",
    feynman:
      "Explain why final answer quality alone is insufficient for evaluating RAG. Then contrast retrieval recall and answer correctness. Finally, design a RAG eval for a policy Q&A system.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4 — ARCHITECTURE PATTERNS (7 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "error-recovery",
    category: "Architecture",
    order: 34,
    title: "Error Handling & Recovery",
    prereqs: ["agentic-loop", "tools"],
    core: "Agents fail constantly — robust systems treat errors as information, retry intelligently, and use fallback strategies rather than crashing blindly.",
    analogy:
      "A good employee doesn't freeze when something goes wrong; they adapt, report, and try a different approach.",
    details: `
**Error types in agents:**
- **Tool errors**: API failures, timeouts, rate limits, malformed responses
- **LLM errors**: Hallucinated tool calls, invalid arguments, refusals
- **System errors**: Context overflow, budget exceeded, infrastructure failure
- **Logic errors**: Agent takes wrong approach, gets stuck in loops

**Recovery strategies (R-E-S-T):**
- **Retry**: Same action with backoff (for transient errors)
- **Escalate**: Ask for human help or switch to a fallback agent
- **Safeguard**: Checkpoint state before risky actions
- **Trace**: Log everything for post-mortem debugging

**Key design principle:** Send tool errors back to the model as tool_result messages. The model often self-corrects when it sees what went wrong.

\`\`\`python
try:
    result = execute_tool(tool_name, tool_input)
except Exception as e:
    result = f"Error: {str(e)}. Please try a different approach."
# Always send result back to model — errors are information
\`\`\`
    `,
    flashQ: "A tool returns an error. Should your agent code crash, retry silently, or send the error back to the model? Why?",
    flashA:
      "Send the error back to the model as a tool_result. The model often self-corrects when it sees what went wrong — it can retry with different arguments or try a different tool entirely.",
    feynman:
      "Explain why tool errors should go back to the model. Then contrast retry vs fallback strategies. Finally, design a recovery strategy for an API failure mid-task.",
  },
  {
    id: "skills-vs-tools",
    category: "Architecture",
    order: 35,
    title: "Skills vs Tools",
    prereqs: ["tools", "agentic-loop"],
    core: "Tools are external functions; skills are reusable internal procedures for solving recurring classes of problems. Skills reduce variance by encoding best practices.",
    analogy:
      "A hammer is a tool. Knowing how to frame a wall is a skill — it combines tools with judgment and procedure.",
    details: `
**Tools:** External functions the agent calls
- web_search, read_file, run_tests, send_email
- Atomic operations that do one thing

**Skills:** Reusable procedures that combine tools + reasoning
- "Verify a claim with 2 independent sources"
- "Debug a test failure: read error → find source → fix → rerun"
- "Research a topic: search → read → synthesize → cite"

**Why skills matter:**
- Free-form prompting produces high variance
- Skills encode best practices as repeatable procedures
- Agents with skills are more predictable and reliable
- Skills can be tested independently

**Implementation:** Skills are typically encoded as detailed instructions in the system prompt or as sub-agent definitions.
    `,
    flashQ: "What's the difference between a tool and a skill, and why does it matter for agent reliability?",
    flashA:
      "A tool performs an external function (web_search). A skill is a reusable procedure combining tools with reasoning ('verify with 2 sources'). Skills reduce variance by encoding best practices.",
    feynman:
      "Explain why not everything should be left to free-form prompting. Then design a 'verify with 2 sources' skill. Finally, contrast a skill library and a tool library.",
  },
  {
    id: "tool-design",
    category: "Architecture",
    order: 36,
    title: "Tool Design for Agents",
    prereqs: ["tools", "error-recovery"],
    core: "Good tool design makes agents more reliable by reducing ambiguity and returning structured results the model can reason over.",
    analogy:
      "A machine with vague instructions gets used wrong. A machine with clear labels, one button, and a status light gets used right.",
    details: `
**5 traits of a well-designed tool:**
1. **Clear purpose**: Description tells the model exactly when and why to use it
2. **Tight schema**: Required params, enums for fixed choices, no ambiguous fields
3. **Structured output**: JSON with consistent fields, not free-form text
4. **Explicit errors**: Error messages that help the model self-correct
5. **Narrow scope**: One tool, one job (don't combine search + write)

**Bad tool design example:**
\`\`\`json
{"name": "do_stuff", "description": "Does various things", "input_schema": {"type": "object", "properties": {"data": {"type": "string"}}}}
\`\`\`

**Good tool design example:**
\`\`\`json
{"name": "search_knowledge_base", "description": "Search internal docs by semantic query. Returns top 5 chunks with source URLs. Use when the user asks about company policies, procedures, or internal knowledge.", "input_schema": {"type": "object", "properties": {"query": {"type": "string", "description": "Semantic search query"}, "category": {"type": "string", "enum": ["policy", "engineering", "hr", "finance"]}}, "required": ["query"]}}
\`\`\`

**Key insight:** Tool descriptions are prompts — the model reads them to decide when and how to call tools. Vague descriptions → wrong tool choices.
    `,
    flashQ: "Why is a tool description essentially a prompt?",
    flashA:
      "Because the model reads tool descriptions to decide when and how to call each tool. Vague descriptions lead to wrong tool selection, bad arguments, and unreliable behavior.",
    feynman:
      "Explain why tool design is partly prompt design. Then rewrite a bad tool description into a good one. Finally, describe the failure modes that come from vague tools.",
  },
  {
    id: "structured-outputs",
    category: "Architecture",
    order: 37,
    title: "Structured Outputs & JSON Mode",
    prereqs: ["tools", "tool-design"],
    core: "Structured outputs constrain the model to produce valid JSON matching a schema, making tool use and downstream parsing reliable instead of brittle.",
    analogy:
      "Instead of asking someone to describe a form verbally, give them the actual form to fill out — the format guarantees usable data.",
    details: `
**Why structured outputs matter for agents:**
- Tool arguments must be valid JSON — malformed JSON breaks the loop
- Downstream systems need predictable schemas
- Reduces parsing errors and retry loops
- Makes agent outputs testable and composable

**Implementation approaches:**
1. **Tool use schemas**: Claude's tool_use already enforces JSON schemas
2. **Response format**: Some APIs support JSON mode or schema enforcement
3. **Prompt-based**: "Respond with valid JSON matching this schema: {...}"
4. **Validation layer**: Parse and validate outputs, retry on failure

**Best practices:**
- Use enums for fixed-choice fields (don't let the model invent values)
- Keep schemas flat where possible (deep nesting increases errors)
- Include descriptions in the schema (helps the model fill correctly)
- Validate on receipt, retry with error message if invalid

**Common failure:** Agent returns almost-valid JSON that breaks the parser (missing comma, extra field, wrong type). Always validate.
    `,
    flashQ: "Why do tool-use schemas already solve most structured output problems for agents?",
    flashA:
      "Because Claude's tool_use mechanism enforces the JSON schema you define — the model must produce valid JSON matching your input_schema. This gives you structured, type-safe arguments without extra parsing.",
    feynman:
      "Explain why structured outputs matter more for agents than chatbots. Then contrast schema-enforced and prompt-based approaches. Finally, describe what breaks in the agentic loop when outputs aren't structured.",
  },
  {
    id: "determinism-variance",
    category: "Architecture",
    order: 38,
    title: "Determinism, Variance, and Reproducibility",
    prereqs: ["probabilistic-models"],
    core: "LLM systems are inherently variable, so production design must manage variance and create as much reproducibility as the use case requires.",
    analogy:
      "You are managing a distribution of plausible outputs, not one machine-stamped answer.",
    details: `
**Sources of variance:**
- **Sampling**: Temperature, top-p create different outputs each run
- **Retrieval differences**: Different chunks retrieved each time
- **Tool nondeterminism**: External APIs return different results
- **Long-loop divergence**: Small differences compound over many iterations

**Strategies for managing variance:**
- Temperature 0 for maximum consistency (but not true determinism)
- Structured outputs to constrain the output space
- Verification steps to catch bad outputs regardless of path
- Eval suites that test across multiple runs, not just one
- Seed parameters where available

**Healthy vs dangerous variance:**
- **Healthy**: Different wording, different tool order, same correct result
- **Dangerous**: Different conclusions, different actions, inconsistent outcomes
- Production systems should tolerate healthy variance and catch dangerous variance
    `,
    flashQ: "Two runs of the same agent produce different action sequences but both reach the correct answer. Is this a problem?",
    flashA:
      "No — this is healthy variance. Different paths to the same correct result are expected from probabilistic systems. The problem is when variance leads to different conclusions or wrong actions.",
    feynman:
      "Explain why two correct runs can still look different. Then contrast healthy and dangerous variance. Finally, describe how you would improve reproducibility for a production agent.",
  },
  {
    id: "canonical-architectures",
    category: "Architecture",
    order: 39,
    title: "Canonical Agent Architectures",
    prereqs: ["agentic-loop", "error-recovery", "planning"],
    core: "Common agent architectures include single-agent with tools, router + specialists, planner + executor, pipelines, parallel specialists, and critic/reviewer systems.",
    analogy:
      "Different org charts for different kinds of work — choose the structure that fits the problem.",
    details: `
**The patterns:**

1. **Single-agent with tools**: One agent, multiple tools, agentic loop
   - Best for: Focused tasks with clear tool boundaries
   - Example: Coding agent with read/write/test tools

2. **Router + specialists**: Classifier sends tasks to domain experts
   - Best for: Diverse request types needing different expertise
   - Example: Support bot routing to billing, technical, or HR agents

3. **Planner + executor**: One agent plans, another executes steps
   - Best for: Complex tasks needing strategic decomposition
   - Example: Research agent that plans queries, then a fetcher executes

4. **Multi-agent pipeline**: Sequential processing stages
   - Best for: Tasks with clear sequential phases
   - Example: Draft → review → edit → publish

5. **Parallel specialists + aggregator**: Multiple agents work simultaneously
   - Best for: Tasks that can be parallelized
   - Example: Search 5 sources in parallel, then synthesize

6. **Critic / reviewer**: Generator produces, critic checks, iterate
   - Best for: Quality-sensitive outputs needing verification
   - Example: Code generator + test runner + code reviewer
    `,
    flashQ: "A product needs to handle billing questions, technical issues, and account changes from a single chat interface. Which architecture?",
    flashA:
      "Router + specialists. A classifier routes each request to a billing, technical, or account specialist agent. Each specialist has its own tools and prompts optimized for its domain.",
    feynman:
      "Contrast single-agent and router + specialists. Then explain when you'd want a critic architecture. Finally, design an architecture for enterprise research.",
  },
  {
    id: "mental-model-summary",
    category: "Architecture",
    order: 40,
    title: "Mental Model Summary — Building Agents from the Ground Up",
    prereqs: ["what-is-an-llm", "context-engineering", "what-is-rag", "agentic-loop"],
    core: "A practical agent is: probabilistic model + context engineering + tools + memory + retrieval + verification + orchestration.",
    analogy:
      "Brain, situation awareness, hands, notebook, librarian, quality control, management — the 7 layers of a working agent.",
    details: `
**The 7-layer stack:**
*Build Context, Then Make Reliable Verified Output*

1. **Base model**: The LLM — probabilistic, capable, imperfect
2. **Context**: What information the model sees (context engineering)
3. **Tools**: How the model interacts with the world
4. **Memory**: How state persists across steps and sessions
5. **Retrieval**: How the model gets grounded knowledge
6. **Verification**: How outputs are checked for correctness
7. **Orchestration**: How multiple agents coordinate

**Why this mental model matters:**
- When an agent fails, diagnose which layer broke
- When designing, ensure each layer is addressed
- When optimizing, know which layer to improve
- Most failures are in layers 2-3 (context and tools), not layer 1 (model)

**The most underestimated layer:** Context engineering. Teams blame the model when the real problem is what information was (or wasn't) in context.
    `,
    flashQ: "An agent retrieves correct documents but still gives wrong answers. Which layer in the 7-layer stack should you investigate?",
    flashA:
      "Layer 2 (Context) — the retrieved docs may not be salient enough in context, or Layer 6 (Verification) — there may be no check on the answer. Retrieval succeeded but context packing or verification failed.",
    feynman:
      "Explain the full 7-layer stack in under 2 minutes. Then identify which layer is most often underestimated. Finally, use the stack to diagnose a failure in a research agent.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 5 — USE CASES & PRODUCTION (9 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "use-cases",
    category: "Production",
    order: 41,
    title: "High-Value Agent Use Cases",
    prereqs: ["what-is-agent", "tools", "agentic-loop"],
    core: "The best agent use cases are multi-step, tool-heavy, nuanced, and tedious for humans — but too flexible for rigid automation.",
    analogy:
      "Agents thrive in the gap between 'scriptable but brittle' and 'human-doable but tedious.'",
    details: `
**Strong agent categories:**
- **Coding agents**: Write, test, debug, refactor code
- **Research agents**: Search, read, synthesize, cite across sources
- **Data pipeline agents**: Extract, transform, validate, load data
- **Support agents**: Triage, look up answers, draft responses, escalate

**The sweet spot checklist:**
- ✅ Multi-step execution required
- ✅ Tool use required (can't be solved with text alone)
- ✅ Nuanced judgment needed (not purely rule-based)
- ✅ Error recovery matters (not a one-shot operation)
- ✅ Tedious for humans to do manually at scale

**Weak agent use cases:**
- ❌ Single-step tasks (just use a prompt)
- ❌ Fully deterministic workflows (just use code)
- ❌ Real-time requirements (agents are slow)
- ❌ Zero-tolerance error domains without verification
    `,
    flashQ: "What 3 characteristics make a task ideal for an agent vs a simpler approach?",
    flashA:
      "Multi-step execution, tool use required, and nuanced judgment that's too flexible for scripts but too tedious for humans at scale.",
    feynman:
      "Pick one use case and design its tools. Then contrast a good and bad use case for agents. Finally, explain why nuance is the key differentiator.",
  },
  {
    id: "coding-agents",
    category: "Production",
    order: 42,
    title: "Deep Dive: Coding Agents",
    prereqs: ["use-cases", "agentic-loop", "tools"],
    core: "Coding agents succeed because code is text, tests provide deterministic feedback, and iteration loops can self-correct.",
    analogy:
      "A junior developer with infinite patience and no ego — willing to try, fail, learn, and retry until tests pass.",
    details: `
**Why coding agents work so well:**
- Code is structured text (LLMs are good at text)
- Tests provide **deterministic verification** (pass/fail, not opinion)
- File systems provide **observable state** (read what you wrote)
- Errors are **informative** (stack traces tell you what went wrong)

**Core toolkit:**
- \`read_file\` / \`write_file\`: Navigate and modify code
- \`search_code\`: Find relevant files and functions
- \`run_tests\`: Verify changes work
- \`run_command\`: Execute build, lint, or other tools

**The power loop:**
1. Read code → understand the codebase
2. Plan changes → decompose the task
3. Write code → make edits
4. Run tests → verify correctness
5. If tests fail → read error, fix, rerun
6. Repeat until tests pass

**Key rule:** Never claim success without passing tests.
    `,
    flashQ: "Why are coding agents one of the strongest agent categories?",
    flashA:
      "Deterministic feedback (tests pass/fail), constrained action space (text files), informative errors (stack traces), and strong self-correction loops. The agent can verify its own work.",
    feynman:
      "Design a failing-test fixer agent with its toolkit. Then contrast coding agents and research agents. Finally, explain why tests are such a powerful verification mechanism.",
  },
  {
    id: "research-agents",
    category: "Production",
    order: 43,
    title: "Deep Dive: Research Agents",
    prereqs: ["use-cases", "agentic-loop"],
    core: "Research agents gather, synthesize, and cite evidence from multiple sources; their hardest problem is knowing when there is enough information to answer.",
    analogy:
      "A librarian who not only finds books but reads, cross-checks, and briefs you — and knows when to stop looking.",
    details: `
**Core toolkit:**
- \`web_search\`: Find relevant sources
- \`fetch_url\`: Read full content from URLs
- \`note_evidence\`: Save key findings with source attribution
- \`synthesize\`: Generate final answer from collected evidence

**Research strategies:**
- **Breadth-first**: Survey many sources quickly, then go deep
- **Depth-first**: Follow one thread deeply, then broaden
- **Adaptive**: Start broad, go deep where evidence is strongest

**The hardest problem:** Knowing when to stop.
- Too early: Incomplete or wrong answer
- Too late: Wasted tokens, search-forever failure mode

**Stopping signals:**
- Multiple sources agree on the answer
- Evidence directly answers the question
- Search budget exhausted
- Diminishing returns from additional searches
    `,
    flashQ: "What is the hardest challenge for a research agent, and how do you address it?",
    flashA:
      "Knowing when it has enough information to answer. Address with: convergence detection (multiple sources agree), search budget limits, and diminishing-returns detection.",
    feynman:
      "Design a research strategy for a current-events question. Then contrast breadth-first and depth-first research. Finally, explain the search-forever failure mode and how to prevent it.",
  },
  {
    id: "safety-reliability",
    category: "Production",
    order: 44,
    title: "Safety, Reliability & Human-in-the-Loop",
    prereqs: ["agentic-loop", "error-recovery"],
    core: "Production agents need permission tiers, approval checkpoints, fallback logic, and strong guardrails — especially for irreversible actions.",
    analogy:
      "A new employee should not start with the master key. Earn trust through read-only access first.",
    details: `
**Permission tiers:**
1. **Read-only**: Search, read files, query databases
2. **Write with approval**: Draft emails, propose changes (human approves)
3. **Write with guardrails**: Execute within strict constraints
4. **Full autonomy**: Only for well-tested, low-risk operations

**Reliability patterns:**
- **Retry with backoff**: For transient failures
- **Checkpoint saving**: Save state before risky actions (can rollback)
- **Fallback tools**: If primary tool fails, try an alternative
- **Timeout budgets**: Wall-clock and token limits
- **Structured outputs**: Reduce parsing failures

**Human-in-the-loop patterns:**
- Approval gates before destructive actions
- Confidence thresholds (escalate when uncertain)
- Periodic review of agent decisions
- Override mechanisms for urgent situations
    `,
    flashQ: "Why is deleting a file fundamentally different from giving a wrong answer in an agent context?",
    flashA:
      "A wrong answer can be corrected. A deleted file may be unrecoverable. Irreversible actions require higher permission tiers, approval gates, and checkpointing — the blast radius is completely different.",
    feynman:
      "Explain the 4 permission tiers for agent actions. Then contrast read-only and destructive operations. Finally, design a human approval rule for a production agent.",
  },
  {
    id: "prompt-injection-security",
    category: "Production",
    order: 45,
    title: "Prompt Injection & Agent Security",
    prereqs: ["safety-reliability", "prompting-for-agents"],
    core: "Prompt injection is when untrusted input tricks the model into ignoring its instructions or taking unauthorized actions — and agents with tools make this especially dangerous.",
    analogy:
      "If a chatbot falls for prompt injection, it says something wrong. If an agent falls for it, it does something wrong — with real-world tools.",
    details: `
**Types of prompt injection:**
- **Direct injection**: User provides instructions that override the system prompt
- **Indirect injection**: Malicious content in retrieved docs, emails, or web pages tricks the agent
- **Tool-result injection**: Malicious data in tool responses manipulates agent behavior

**Why agents are higher risk:**
- Agents have tools that take real-world actions (send emails, write files, make API calls)
- Injected instructions can escalate from "say something wrong" to "do something wrong"
- Multi-step loops give injected instructions more opportunities to influence behavior

**Defense strategies:**
1. **Input sanitization**: Strip or escape suspicious patterns
2. **Privilege separation**: Limit tool access based on trust level
3. **Output validation**: Check agent actions against policy before execution
4. **Instruction hierarchy**: System prompt > user message > retrieved content
5. **Monitoring**: Flag unusual tool call patterns for review

**Key principle:** Never trust content from tools, retrieved documents, or user inputs as instructions. Treat all external content as data, not commands.
    `,
    flashQ: "How is prompt injection more dangerous in an agent than in a chatbot?",
    flashA:
      "A chatbot can only say wrong things. An agent can do wrong things — send emails, delete files, make API calls. Prompt injection in agents escalates from misinformation to unauthorized actions.",
    feynman:
      "Explain direct vs indirect prompt injection. Then describe why multi-step agents are especially vulnerable. Finally, design a defense strategy for an agent that processes customer emails.",
  },
  {
    id: "evals",
    category: "Production",
    order: 46,
    title: "Evaluating Agents",
    prereqs: ["agentic-loop", "use-cases"],
    core: "Agent evaluation must measure task success, action quality, efficiency, cost, and failure behavior — not just final answer quality.",
    analogy:
      "Grading a project with a rubric covering process, not just a multiple-choice score on the final answer.",
    details: `
**Key metrics:**
- **Task completion rate**: Did the agent achieve the goal?
- **Step efficiency**: How many actions to reach the goal?
- **Tool accuracy**: Were tool calls correct and necessary?
- **Action hallucination rate**: How often did it call wrong tools or pass wrong args?
- **Cost per task**: Total tokens × price
- **Latency**: Wall-clock time from request to completion

**Eval types:**
- **Unit evals**: Test individual tool calls and decisions
- **Task evals**: Test end-to-end task completion
- **Regression evals**: Ensure changes don't break existing behavior
- **Adversarial evals**: Test edge cases and failure modes

**Practical setup:**
1. Create 20-50 test cases with known-good outcomes
2. Run agent on each test case (multiple runs for variance)
3. Score on multiple dimensions (not just pass/fail)
4. Track trends over time
5. Add new test cases for every bug found in production
    `,
    flashQ: "Why is measuring only 'did the agent get the right answer' insufficient for evaluation?",
    flashA:
      "Because an agent might get the right answer through luck (hallucination that happens to be correct), excessive cost (50 tool calls for a 3-step task), or dangerous paths (ignoring safety checks). Process quality matters.",
    feynman:
      "Explain why final answer quality alone is insufficient. Then contrast eval approaches for coding vs research agents. Finally, design a small eval suite for a customer support agent.",
  },
  {
    id: "cost-optimization",
    category: "Production",
    order: 47,
    title: "Cost Optimization for Agents",
    prereqs: ["agentic-loop", "evals"],
    core: "Agent costs compound across loops because context is repeatedly re-sent and expanded. Optimization requires prompt caching, context pruning, model cascading, and early termination.",
    analogy:
      "A taxi meter that charges by the word, and the receipt gets longer every block you drive.",
    details: `
**Where the money goes:**
- Input tokens are charged **every iteration** (context is resent)
- System prompt + tool definitions = fixed cost per iteration
- Tool results accumulate = growing cost per iteration
- A 10-step agent might use 500K+ total tokens

**Cost levers:**
1. **Prompt caching**: Cache stable prefix (system prompt, tools) — saves 90% on cached tokens
2. **Model cascading**: Use a smaller model for simple steps, larger for complex ones
3. **Context pruning**: Summarize old tool results, drop unnecessary history
4. **Early termination**: Stop when the goal is clearly met (don't overshoot)
5. **Batched tool calls**: Call multiple tools in one turn when possible

**Token economics:**
- Claude Sonnet input: ~$3/M tokens, output: ~$15/M tokens
- A 10-step agent with 20K context per step ≈ 200K input tokens ≈ $0.60 per task
- With caching: 15K cached + 5K uncached per step ≈ $0.15 per task (75% savings)

**Rule of thumb:** If your agent costs more than $1 per task, you have optimization opportunities.
    `,
    flashQ: "An agent costs $2 per task. Where would you look first to cut costs?",
    flashA:
      "1) Enable prompt caching for the system prompt and tool definitions (biggest single lever). 2) Prune old tool results between iterations. 3) Check if the agent is taking unnecessary steps (early termination).",
    feynman:
      "Explain where the money goes in a 10-step agentic loop. Then contrast model quality and cost. Finally, design a cheaper architecture for a simple agent task.",
  },
  {
    id: "observability-tracing",
    category: "Production",
    order: 48,
    title: "Observability and Tracing",
    prereqs: ["evals", "safety-reliability", "agentic-loop"],
    core: "Observability is the ability to inspect what the agent did, why it did it, and where failure occurred — essential for debugging non-deterministic multi-step systems.",
    analogy:
      "Your agent needs a black box recorder — you can't debug what you can't see.",
    details: `
**What to log per iteration:**
- Prompt version and content
- Tool calls (name, arguments, results)
- Retrieved context (what was fetched)
- Model reasoning (if using extended thinking)
- Errors and retries
- Token usage and cost
- Latency per step
- Final result and confidence

**Why observability is non-negotiable:**
- Agents are non-deterministic — same input, different paths
- Final outputs don't explain intermediate decisions
- Failures can be silent (wrong answer with high confidence)
- Cost overruns happen in the middle, not at the end

**Tools and patterns:**
- Structured logging (JSON) for machine-parseable traces
- Request IDs for correlating multi-step interactions
- Dashboards for cost, latency, and error rate trends
- Alert thresholds for anomalous behavior
    `,
    flashQ: "An agent completes a task but the answer is wrong. Without observability, what's impossible to determine?",
    flashA:
      "Where it went wrong. Was the retrieval bad? Did it hallucinate tool arguments? Did it ignore evidence? Was there an error it recovered from incorrectly? Without traces, you're guessing.",
    feynman:
      "Explain why final outputs are not enough for debugging agents. Then describe what you would log for a research agent. Finally, give examples of failures that become invisible without tracing.",
  },
  {
    id: "production-readiness-checklist",
    category: "Production",
    order: 49,
    title: "Production Readiness Checklist",
    prereqs: ["safety-reliability", "evals", "observability-tracing", "cost-optimization"],
    core: "An agent is production-ready only when scope, tools, evals, observability, reliability, cost controls, and security are all in place.",
    analogy:
      "A demo car that moves is not roadworthy — it needs brakes, mirrors, gauges, insurance, and a test drive.",
    details: `
**The checklist:**
- ☐ **Clear scope**: Agent's job is well-defined and bounded
- ☐ **Tool controls**: Permission tiers, input validation, output checking
- ☐ **Eval suite**: 20+ test cases covering happy path, edge cases, and adversarial inputs
- ☐ **Observability**: Full tracing, cost tracking, error logging
- ☐ **Reliability**: Error recovery, retries, fallbacks, timeouts
- ☐ **Cost tracking**: Budget alerts, per-task cost monitoring
- ☐ **Security**: Prompt injection defenses, input sanitization
- ☐ **Human escalation**: Clear paths for the agent to ask for help
- ☐ **Rollback plan**: How to disable or revert if something goes wrong
- ☐ **Documentation**: Architecture diagram, tool descriptions, known limitations

**The gap between demo and production:**
A demo shows the happy path. Production handles the 1000 things that can go wrong.

**Launch strategy:** Start with read-only access and human-in-the-loop for all write actions. Gradually increase autonomy as confidence builds from eval results and production data.
    `,
    flashQ: "What's the most dangerous gap between a demo agent and a production agent?",
    flashA:
      "Error handling and security. A demo shows the happy path. Production must handle tool failures, prompt injection, unexpected inputs, cost overruns, and every edge case — with logging to debug what went wrong.",
    feynman:
      "Explain why a working demo is not a production system. Then define what 'safe to ship' means for an agent. Finally, design a launch checklist with a gradual autonomy ramp-up.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 6 — ORCHESTRATION (5 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "orchestration",
    category: "Orchestration",
    order: 50,
    title: "Multi-Agent Orchestration",
    prereqs: ["agentic-loop", "planning"],
    core: "Orchestration coordinates multiple specialized agents to solve problems too complex or broad for a single agent.",
    analogy:
      "One agent is a freelancer. Many agents are a company — someone has to manage the team.",
    details: `
**Orchestration patterns:**
1. **Hierarchical**: Manager agent delegates to specialists
2. **Pipeline**: Sequential processing (Agent A → Agent B → Agent C)
3. **Parallel**: Multiple agents work simultaneously, results are merged
4. **Debate / Critic**: Agents argue or review each other's work

**When to use multi-agent:**
- Task requires genuinely different expertise or tools
- Workload can be parallelized for speed
- Quality improves from review/critique passes
- Single agent's context would be too large

**When NOT to use multi-agent:**
- Single agent can handle it (don't overengineer)
- Communication overhead exceeds the benefit
- Tasks are tightly coupled (splitting creates more problems)
    `,
    flashQ: "Name 4 multi-agent orchestration patterns.",
    flashA:
      "Hierarchical (manager → specialists), Pipeline (sequential stages), Parallel (simultaneous work + merge), and Debate/Critic (adversarial review).",
    feynman:
      "Explain why you'd split work across agents. Then contrast hierarchical and pipeline patterns. Finally, describe when multi-agent is not worth the complexity.",
  },
  {
    id: "agent-handoffs",
    category: "Orchestration",
    order: 51,
    title: "Agent Handoffs & Communication",
    prereqs: ["orchestration"],
    core: "Good handoffs transfer what was done, what is needed next, why it matters, and what constraints apply — structured, not free-form.",
    analogy:
      "A hospital shift change: structured notes ensure nothing falls through the cracks.",
    details: `
**The 4 pieces of a good handoff:**
1. **What was done**: Summary of completed work and findings
2. **What is needed**: Clear next-step request
3. **Why it matters**: Context for priority and approach
4. **Constraints**: Limits, deadlines, quality requirements

**Handoff format example:**
\`\`\`json
{
  "completed": "Searched 5 sources, found 3 relevant articles",
  "findings": [{"source": "url", "key_point": "..."}],
  "request": "Synthesize findings into a 500-word summary",
  "constraints": ["Cite all sources", "Focus on technical details"],
  "priority": "high"
}
\`\`\`

**Anti-patterns:**
- Passing the entire conversation history (too much noise)
- Vague handoffs ("handle this")
- No context about what was already tried
    `,
    flashQ: "What 4 pieces of information should every agent handoff include?",
    flashA:
      "What was done, what is needed next, why it matters, and what constraints apply.",
    feynman:
      "Design a handoff between a researcher agent and a writer agent. Then contrast good and bad handoffs. Finally, describe what fails without structured handoff objects.",
  },
  {
    id: "routing-patterns",
    category: "Orchestration",
    order: 52,
    title: "Routing & Delegation Patterns",
    prereqs: ["orchestration", "agent-vs-workflow"],
    core: "A router classifies tasks and sends them to the right specialist — the triage nurse of multi-agent systems.",
    analogy:
      "A triage nurse doesn't treat everyone; they send people to the right department. Wrong triage = wrong treatment.",
    details: `
**Routing strategies:**
1. **LLM classifier**: Use a model to classify the request
2. **Embedding similarity**: Match against example queries per specialist
3. **Keyword / regex**: Fast, deterministic matching for known patterns
4. **Hierarchical routing**: Broad category first, then sub-category

**Router design:**
- Use a fast, cheap model for routing (don't need the biggest model)
- Include confidence scores — low confidence → fallback or human
- Log routing decisions for analysis and improvement
- Test with adversarial and ambiguous inputs

**Fallback handling:**
- What happens when the router isn't confident?
- Options: ask the user to clarify, send to a generalist, escalate to human
- Never silently send to a wrong specialist
    `,
    flashQ: "A router sends 15% of requests to the wrong specialist. What should you investigate first?",
    flashA:
      "1) Check if those requests are genuinely ambiguous (overlapping domains). 2) Review the routing prompt/examples for unclear boundaries. 3) Add a confidence threshold with fallback for uncertain classifications.",
    feynman:
      "Design a router for 4 specialist agents. Then contrast routing confidence and fallback strategies. Finally, describe what happens when the router is wrong.",
  },
  {
    id: "state-management",
    category: "Orchestration",
    order: 53,
    title: "State Management in Multi-Agent Systems",
    prereqs: ["orchestration", "memory"],
    core: "Multi-agent systems need shared state so agents don't duplicate work or contradict each other.",
    analogy:
      "A renovation team needs a shared project plan — if the electrician and plumber don't coordinate, things break.",
    details: `
**Shared state patterns:**
1. **Central state store**: Single source of truth (database, Redis, shared object)
2. **Event sourcing**: State = sequence of events, each agent publishes events
3. **Blackboard architecture**: Shared workspace agents can read and write

**What shared state tracks:**
- Overall task progress
- What each agent has completed
- Intermediate results and findings
- Constraints and decisions made
- Budget remaining (tokens, time, cost)

**Race conditions and conflicts:**
- Two agents might try to modify the same resource
- Solutions: locking, turn-based execution, optimistic concurrency
- In practice, most agent systems use sequential handoffs (avoiding true concurrency)
    `,
    flashQ: "What are 3 patterns for managing shared state in multi-agent systems?",
    flashA:
      "Central state store, event sourcing, and blackboard architecture.",
    feynman:
      "Explain why shared state matters in multi-agent systems. Then contrast blackboard and central store patterns. Finally, describe what race conditions can happen without state controls.",
  },
  {
    id: "agent-sdk",
    category: "Orchestration",
    order: 54,
    title: "Claude Agent SDK",
    prereqs: ["orchestration", "agentic-loop"],
    core: "The Claude Agent SDK handles loop logic, tool execution, handoffs, guardrails, and tracing so developers can focus on agent behavior rather than plumbing.",
    analogy:
      "Like a web framework vs building from raw sockets — it handles the boilerplate so you can focus on the logic.",
    details: `
**What the SDK handles:**
- Agentic loop execution (no manual while-loop needed)
- Tool registration and execution
- Agent handoffs (built-in transfer protocol)
- Guardrails (input/output validation)
- Tracing and observability

**When to use the SDK vs raw API:**
- **SDK**: Production agents, multi-agent systems, guardrailed apps
- **Raw API**: Learning, prototyping, custom loop logic, maximum control

**Key SDK concepts:**
- \`Agent\`: Defines an agent with tools, system prompt, and handoff targets
- \`Runner\`: Executes the agentic loop
- \`Guardrail\`: Validates inputs/outputs against policies
- \`Handoff\`: Transfer execution from one agent to another

**Trade-off:** The SDK is opinionated — it makes common patterns easy but custom patterns harder. Start with raw API to understand the fundamentals, then switch to SDK for production.
    `,
    flashQ: "When would you use the raw Claude API instead of the Agent SDK?",
    flashA:
      "For learning (understanding the fundamentals), prototyping (quick experiments), custom loop logic (non-standard patterns), or when you need maximum control over every step.",
    feynman:
      "Explain why you'd use an SDK instead of building from raw API calls. Then contrast prototype and production agent needs. Finally, describe when the raw API is actually better.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 7 — CLAUDE API MASTERY (5 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "claude-api-basics",
    category: "Claude API",
    order: 55,
    title: "Claude API Fundamentals",
    prereqs: ["what-is-agent"],
    core: "Claude's Messages API is the structured conversation protocol behind every agent interaction — model, messages, tools, and stop_reason.",
    analogy:
      "You send the transcript so far; Claude adds the next structured turn.",
    details: `
**Core API structure:**
\`\`\`python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    system="You are a helpful research assistant...",
    messages=[
        {"role": "user", "content": "Find information about..."},
    ],
    tools=[...],  # Tool definitions
)
\`\`\`

**Key response fields:**
- \`content\`: Array of content blocks (text, tool_use)
- \`stop_reason\`: Why the model stopped
  - \`"end_turn"\`: Model is done (return result)
  - \`"tool_use"\`: Model wants to call a tool (continue loop)
  - \`"max_tokens"\`: Ran out of output tokens (may need to continue)
- \`usage\`: Token counts (input_tokens, output_tokens)

**The message array is the memory:** Every turn (user, assistant, tool_result) must be appended to maintain conversation state.
    `,
    flashQ: "What are the 3 common stop_reason values and what does each mean for the agentic loop?",
    flashA:
      "end_turn = model is done (return result). tool_use = model wants a tool (run it, continue loop). max_tokens = output truncated (may need to prompt continuation).",
    feynman:
      "Walk through a first API call step by step. Then contrast an assistant text response and a tool-use response. Finally, describe what goes wrong if the message structure is malformed.",
  },
  {
    id: "tool-use-api",
    category: "Claude API",
    order: 56,
    title: "Tool Use in Claude's API",
    prereqs: ["claude-api-basics", "tools"],
    core: "Claude tool use follows a strict request → tool_use → tool_result protocol that must be implemented correctly for the agentic loop to work.",
    analogy:
      "A walkie-talkie protocol with strict turn-taking — break protocol and communication fails.",
    details: `
**The protocol:**
1. Define tools in the API call (name, description, input_schema)
2. Model outputs a \`tool_use\` content block with name + input
3. Your code executes the tool
4. You append the assistant message, then a user message with \`tool_result\`
5. Make another API call — model sees the result and continues

**Message flow:**
\`\`\`
messages = [
  {role: "user", content: "What's the weather?"},
  {role: "assistant", content: [{type: "tool_use", id: "1", name: "get_weather", input: {city: "NYC"}}]},
  {role: "user", content: [{type: "tool_result", tool_use_id: "1", content: "72°F, sunny"}]},
  {role: "assistant", content: [{type: "text", text: "It's 72°F and sunny in NYC!"}]}
]
\`\`\`

**tool_choice options:**
- \`"auto"\`: Model decides whether to use tools (default)
- \`"any"\`: Model must use a tool (forced tool use)
- \`{"type": "tool", "name": "specific_tool"}\`: Force a specific tool

**Common mistakes:**
- Forgetting to include the assistant message before tool_result
- Not matching tool_use_id in the tool_result
- Sending tool_result as a system or assistant message
    `,
    flashQ: "What are the 3 tool_choice options and when would you use each?",
    flashA:
      "auto (model decides — default), any (must use a tool — when you know a tool call is needed), specific tool (force a particular tool — for step-by-step control).",
    feynman:
      "Trace the message array after two tool calls. Then contrast auto and forced tool choice. Finally, describe what breaks when the tool protocol is malformed.",
  },
  {
    id: "extended-thinking",
    category: "Claude API",
    order: 57,
    title: "Extended Thinking",
    prereqs: ["claude-api-basics"],
    core: "Extended thinking gives Claude more internal reasoning budget before responding — like scratch paper before the final answer.",
    analogy:
      "Scratch paper before giving the final answer on an exam — more thinking time for harder problems.",
    details: `
**How it works:**
- Enable with \`thinking: {type: "enabled", budget_tokens: N}\`
- Model uses internal reasoning tokens before producing visible output
- Thinking content is returned in a \`thinking\` content block
- You pay for thinking tokens but they improve quality on complex tasks

**Best use cases:**
- Complex multi-step planning
- Code architecture decisions
- Tradeoff evaluation
- Math and logic problems
- Analyzing ambiguous requirements

**When it's NOT worth it:**
- Simple factual questions
- Short, straightforward responses
- High-volume, low-complexity tasks (cost adds up)

**For agents:** Extended thinking is especially valuable at the **planning** step — before the agent decides its first action. Less valuable for routine tool-call decisions mid-loop.
    `,
    flashQ: "When should an agent use extended thinking: before every tool call, or at specific decision points?",
    flashA:
      "At specific decision points — especially initial planning, complex decomposition, and difficult judgment calls. Using it before every tool call wastes tokens on routine decisions.",
    feynman:
      "Explain when an agent should think before acting vs act immediately. Then contrast low and high reasoning budgets. Finally, describe tasks that don't benefit much from extended thinking.",
  },
  {
    id: "streaming-api",
    category: "Claude API",
    order: 58,
    title: "Streaming & Real-Time Agents",
    prereqs: ["claude-api-basics", "agentic-loop"],
    core: "Streaming lets agents reveal progress in real time, detect tool-use early, and provide better perceived latency to users.",
    analogy:
      "Watching the pizza cook through the oven window — you know it's working even before it's done.",
    details: `
**Why streaming matters for agents:**
- Users see progress instead of waiting for long operations
- You can detect tool_use blocks early and start executing
- Perceived latency drops dramatically
- Error detection happens sooner

**Key streaming events:**
- \`message_start\`: Response begins
- \`content_block_start\`: New content block (text or tool_use)
- \`content_block_delta\`: Incremental content
- \`content_block_stop\`: Block complete
- \`message_stop\`: Response complete

**Implementation pattern:**
\`\`\`python
with client.messages.stream(model=model, messages=messages, tools=tools) as stream:
    for event in stream:
        if event.type == "content_block_start" and event.content_block.type == "tool_use":
            # Tool call detected — can prepare execution
            ...
        elif event.type == "text":
            # Stream text to user in real time
            print(event.text, end="")
\`\`\`
    `,
    flashQ: "Name 3 reasons streaming is important for agent UX.",
    flashA:
      "Progress feedback (users see work happening), early tool detection (start executing sooner), and better perceived latency (response feels faster).",
    feynman:
      "Explain streaming to a frontend developer. Then contrast streaming and non-streaming agent UX. Finally, describe which streaming events matter most for agents.",
  },
  {
    id: "prompt-caching",
    category: "Claude API",
    order: 59,
    title: "Prompt Caching for Agents",
    prereqs: ["claude-api-basics", "agentic-loop"],
    core: "Prompt caching reduces cost and latency by reusing repeated prompt prefixes — especially valuable in looped agent calls where the system prompt and tools are resent every iteration.",
    analogy:
      "Read the handbook once, then refer back to it cheaply — don't re-read it from scratch every time.",
    details: `
**Why caching matters for agents:**
- System prompt + tool definitions are identical every iteration
- Without caching: 15K tokens × 10 iterations = 150K input tokens at full price
- With caching: 15K cached tokens × 10 iterations at ~90% discount

**What to cache (stable prefix):**
- System prompt
- Tool definitions
- Long static context (few-shot examples, reference docs)

**What NOT to cache (changes each turn):**
- Conversation history (grows each iteration)
- Tool results (different each time)
- Working memory (updated each step)

**Implementation:**
Mark cache boundaries with \`cache_control\`:
\`\`\`python
system=[
  {"type": "text", "text": "Your system prompt here..."},
  {"type": "text", "text": "Tool instructions...", "cache_control": {"type": "ephemeral"}}
]
\`\`\`

**Cost math:** If system prompt = 10K tokens, 10 iterations:
- Without caching: 100K tokens at full price
- With caching: 10K write + 90K read at 10% cost = ~82% savings
    `,
    flashQ: "Calculate the approximate savings from caching a 10K-token system prompt across 10 agent iterations.",
    flashA:
      "Without caching: 100K tokens at full price. With caching: 10K write (first iteration) + 90K at 10% price = ~82% cost savings on the cached portion.",
    feynman:
      "Explain why caching is especially valuable for looped agents. Then contrast cacheable vs non-cacheable context. Finally, describe what content should sit at the start of the prompt and why.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 8 — STUDY SYSTEM & SYNTHESIS (8 topics)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mnemonic-pack",
    category: "Study System",
    order: 60,
    title: "Mnemonic Pack",
    prereqs: ["mental-model-summary"],
    core: "Mnemonics compress complex ideas into memorable shorthand for faster recall — turning frameworks into something you can recite under pressure.",
    analogy:
      "Turning a long route into a landmark map — you remember the landmarks, and the details follow.",
    details: `
**Core mnemonics:**

| Mnemonic | Stands For | Concept |
|----------|-----------|---------|
| **P-R-A-M-G** | Perception, Reasoning, Action, Memory, Goal | Agent definition |
| **G-R-A-C-E** | Ground, Retrieve, Anchor, Constrain, Evaluate | Hallucination reduction |
| **I-K-B** | Instructions, Knowledge, Behavior | Prompt vs RAG vs Fine-tuning |
| **S-T-A-C-K** | Select, Trim, Arrange, Compress, Keep-updated | Context engineering |
| **W-E-E-S** | Working, Episodic, External, Semantic | Memory types |
| **C-E-R-R-A** | Chunk, Embed, Retrieve, Rerank, Answer | RAG pipeline |
| **R-E-S-T** | Retry, Escalate, Safeguard, Trace | Production reliability |

**7-layer stack sentence:**
*"Build Context, Then Make Reliable Verified Output"*
→ Base model, Context, Tools, Memory, Retrieval, Verification, Orchestration

**How to use:** Test yourself daily. Can you recite each from memory? Can you expand each letter into a full explanation?
    `,
    flashQ: "What does G-R-A-C-E stand for, and when do you use it?",
    flashA:
      "Ground, Retrieve, Anchor, Constrain, Evaluate — the 5 defenses against hallucination. Use it when designing systems that need reliable, grounded outputs.",
    feynman:
      "Explain why mnemonics help technical learning. Then contrast memorization and understanding. Finally, design a mnemonic for a concept that doesn't have one yet.",
  },
  {
    id: "flashcard-expansion",
    category: "Study System",
    order: 61,
    title: "Flashcard Expansion Logic",
    prereqs: ["mnemonic-pack"],
    core: "Strong flashcards test definition, contrast, and application — not just one-line recall. Three cards per topic creates deep understanding.",
    analogy:
      "Knowing the name, knowing the difference from similar things, and knowing how to use it — three levels of mastery.",
    details: `
**3 card types per topic:**

1. **Definition card**: "What is X?"
   - Tests basic recall
   - Example: "What is RAG?" → "Retrieve relevant info at runtime, inject into context, generate grounded answer"

2. **Contrast card**: "How is X different from Y?"
   - Tests discrimination between similar concepts
   - Example: "How is RAG different from fine-tuning?" → "RAG injects runtime knowledge; fine-tuning changes model behavior"

3. **Application / Failure card**: "When do you use X?" or "What goes wrong without X?"
   - Tests judgment and practical understanding
   - Example: "When does vector RAG fail?" → "Exact-match queries, relationship-heavy queries, filtering by specific attributes"

**Why 3 cards matter:**
- Definition alone = surface-level recall
- Contrast = distinguishing similar concepts (where confusion lives)
- Application = practical judgment (where value lives)
    `,
    flashQ: "Why is one flashcard per topic insufficient for deep learning?",
    flashA:
      "One card tests only definition recall. You also need contrast cards (distinguishing similar concepts) and application cards (practical judgment). Confusion lives in the gaps between concepts, not in isolated definitions.",
    feynman:
      "Explain why contrast cards are more valuable than definition cards. Then build 3 cards for context engineering. Finally, contrast recall and discrimination in learning.",
  },
  {
    id: "feynman-logic",
    category: "Study System",
    order: 62,
    title: "Feynman Prompt Logic",
    prereqs: ["flashcard-expansion"],
    core: "The best Feynman prompts force you to explain simply, contrast with adjacent concepts, and apply or debug in practice — three modes of understanding.",
    analogy:
      "Not just naming the tool, but teaching someone else to use it, comparing it to similar tools, and troubleshooting when it breaks.",
    details: `
**3 Feynman modes per topic:**

1. **Explain mode**: Explain the concept simply to a beginner
   - Forces you to strip away jargon
   - Reveals gaps in understanding
   - "Explain RAG to a non-technical PM"

2. **Contrast mode**: Explain how it differs from the closest adjacent concept
   - Forces you to identify boundaries
   - Clarifies where concepts overlap and diverge
   - "Explain how RAG differs from fine-tuning"

3. **Apply / Failure mode**: Explain how to implement it, or what breaks if it's skipped
   - Forces practical understanding
   - Connects theory to real-world consequences
   - "What goes wrong in a production agent without RAG?"

**Scoring rubric:**
- Did you explain without jargon?
- Did you identify the key distinction?
- Did you connect to a real consequence?
- Could a beginner follow your explanation?
    `,
    flashQ: "What are the 3 Feynman practice modes and why is the contrast mode especially valuable?",
    flashA:
      "Explain (simple explanation), Contrast (distinguish from adjacent concepts), Apply/Failure (practical use or consequences). Contrast is especially valuable because confusion lives in the boundaries between similar concepts.",
    feynman:
      "Explain why contrast deepens understanding more than explanation alone. Then compare a weak Feynman prompt with a strong one. Finally, create 3 Feynman prompts for prompt injection.",
  },
  {
    id: "drill-pack",
    category: "Study System",
    order: 63,
    title: "Drill / Recall Pack",
    prereqs: ["feynman-logic"],
    core: "Drill packs convert notes into repeated retrieval practice across recall, contrast, design, and failure analysis — the gym for your knowledge.",
    analogy:
      "Turning a playbook into scrimmages — you don't just read about basketball, you practice plays.",
    details: `
**4 drill types:**

1. **Quick recall**: "Name the 4 memory types" / "What does C-E-R-R-A stand for?"
   - Tests speed of retrieval
   - Should become automatic with practice

2. **Comparison drills**: "Compare vector RAG and graph RAG" / "Compare skills and tools"
   - Tests ability to distinguish related concepts
   - Builds the mental map of how concepts relate

3. **Design prompts**: "Design a research agent with 4 tools" / "Design a context stack for a support bot"
   - Tests ability to apply knowledge to new problems
   - Reveals whether understanding is deep enough to create

4. **Failure analysis**: "The agent retrieves good docs but gives wrong answers. Diagnose." / "A 10-step agent works on step 1-7 then fails. What happened?"
   - Tests debugging intuition
   - Connects symptoms to root causes
    `,
    flashQ: "Why do drills beat rereading for learning retention?",
    flashA:
      "Rereading creates familiarity (recognition), not retrieval strength (recall). Drills force active retrieval, which strengthens memory far more than passive exposure. Testing effect > re-reading effect.",
    feynman:
      "Explain why drills beat rereading for learning. Then contrast flashcards and drills. Finally, design a drill set for the RAG pipeline.",
  },
  {
    id: "architecture-diagnosis",
    category: "Study System",
    order: 64,
    title: "Architecture Diagnosis Framework",
    prereqs: ["mental-model-summary"],
    core: "When an agent fails, diagnose systematically across 7 layers: model, context, tools, memory, retrieval, verification, and orchestration.",
    analogy:
      "A general-purpose troubleshooting checklist — like a doctor checking vitals before ordering tests.",
    details: `
**The 7-layer diagnostic:**

1. **Model**: Was the task beyond the model's capability?
   - Try a larger model. If it works, model was the bottleneck.

2. **Context**: Did the model have the right information?
   - Check: Was critical info in context? Was it salient?

3. **Tools**: Were tools clear and sufficient?
   - Check: Tool descriptions, schemas, error handling

4. **Memory**: Did the agent lose track of state?
   - Check: Working memory, context overflow, lost information

5. **Retrieval**: Did it fetch the right evidence?
   - Check: Retrieval recall, chunk quality, query relevance

6. **Verification**: Was there a real correctness check?
   - Check: Tests, citations, validation steps

7. **Orchestration**: Was routing or delegation flawed?
   - Check: Router accuracy, handoff quality, state sharing

**Diagnosis process:**
1. Start with the symptom (wrong answer, wrong action, stuck)
2. Walk through each layer
3. Identify the first layer where something went wrong
4. Fix that layer before looking deeper
    `,
    flashQ: "An agent searches correctly but synthesizes a wrong answer from the retrieved docs. Which diagnostic layer should you investigate?",
    flashA:
      "Layer 2 (Context) — the retrieved info may not be salient enough. Then Layer 6 (Verification) — there's no check on the synthesis. Retrieval worked (Layer 5) but context packing or verification failed.",
    feynman:
      "Use the 7-layer framework to debug a broken research agent. Then contrast a tool failure with a context failure. Finally, explain why systematic diagnosis beats random troubleshooting.",
  },
  {
    id: "setup-guide",
    category: "Study System",
    order: 65,
    title: "Build-From-Scratch Setup Guide",
    prereqs: ["architecture-diagnosis"],
    core: "Building an agent well means defining the job, choosing the right architecture, designing tools and context, adding verification, and iterating through evals.",
    analogy:
      "You don't start with autonomy; you start with a job description, a workflow, and controls — then add autonomy gradually.",
    details: `
**The 12-step setup:**
1. **Define the job**: What specific task should the agent do?
2. **Decide if you need an agent**: Could a chain or workflow do this?
3. **Choose architecture**: Single agent, router + specialists, pipeline, etc.
4. **Define tools**: What external functions does it need?
5. **Design the prompt**: Role, rules, tools, output format
6. **Design the context layer**: What information enters context, when, how?
7. **Add memory only if needed**: Don't add complexity without a clear need
8. **Add verification**: How do you know the output is correct?
9. **Add guardrails**: Permission tiers, input validation, output checking
10. **Add observability**: Logging, tracing, cost tracking
11. **Build evals**: Test cases covering happy path, edge cases, adversarial inputs
12. **Iterate on failures**: Fix the most common failure mode, then the next

**Key principle:** Start simple. Add complexity only when evals show you need it.
    `,
    flashQ: "What are the first 3 steps in building an agent from scratch?",
    flashA:
      "1) Define the specific job. 2) Decide if you actually need an agent (vs chain/workflow). 3) Choose the right architecture pattern. Don't touch tools or prompts until these are clear.",
    feynman:
      "Walk through building a minimal agent from zero. Then explain why memory should be added only if needed. Finally, describe what happens if you skip verification and evals.",
  },
  {
    id: "minimal-setup-templates",
    category: "Study System",
    order: 66,
    title: "Minimal Setup Templates",
    prereqs: ["canonical-architectures", "setup-guide"],
    core: "Reusable templates speed up agent design by standardizing goals, tools, state, and verification for common use cases.",
    analogy:
      "Blueprint kits instead of reinventing the house every time — customize from a proven foundation.",
    details: `
**Template 1: Simple Research Agent**
- Goal: Search, read, synthesize, cite
- Tools: web_search, fetch_url, note_evidence
- State: query, sources_found, evidence_collected
- Verification: Multiple source agreement, citation check
- Stopping: Evidence converges or budget exhausted

**Template 2: Coding Agent**
- Goal: Read code, make changes, verify with tests
- Tools: read_file, write_file, search_code, run_tests
- State: task, files_modified, tests_passing
- Verification: All tests pass
- Stopping: Tests pass and task is complete

**Template 3: Internal Knowledge Assistant**
- Goal: Answer from curated document set
- Tools: search_knowledge_base, fetch_document
- State: query, retrieved_evidence, confidence
- Verification: Answer grounded in retrieved docs
- Stopping: Confident answer or "insufficient evidence" response

**How to use:** Start from the closest template. Customize tools, adjust the prompt, add domain-specific verification. Don't start from scratch.
    `,
    flashQ: "What 5 components does every agent template need to specify?",
    flashA:
      "Goal (what to achieve), Tools (external functions), State (what to track), Verification (how to check correctness), and Stopping condition (when to stop).",
    feynman:
      "Explain why templates improve agent development speed. Then contrast a research template and a coding template. Finally, adapt one template to your own use case.",
  },
  {
    id: "setup-failure-modes",
    category: "Study System",
    order: 67,
    title: "Common Setup Failure Modes",
    prereqs: ["minimal-setup-templates"],
    core: "Common setup failures include too much autonomy too early, weak tools, poor context packing, weak retrieval, missing verification, and no evals.",
    analogy:
      "A car with a powerful engine but no brakes, no dashboard, and no map — fast but dangerous.",
    details: `
**The failure modes:**

1. **Too much autonomy too early**: Agent has full write access before behavior is validated
   - Fix: Start read-only, add write with approval, then full autonomy

2. **Weak tools**: Vague descriptions, loose schemas, unstructured outputs
   - Fix: Treat tool descriptions as prompts. Tight schemas. Clear errors.

3. **Bad context packing**: Critical info buried or missing from context
   - Fix: Apply S-T-A-C-K framework. Put important info at top.

4. **Weak retrieval**: Right docs exist but aren't found
   - Fix: Better chunking, metadata, reranking. Test retrieval independently.

5. **No verification**: Agent claims success without checking
   - Fix: Add tests (coding), citation checks (research), schema validation (data)

6. **No evals**: "It works in my demo" ≠ "It works in production"
   - Fix: Build eval suite BEFORE deploying. Add cases for every bug found.

**The pattern:** Most failures aren't about the model — they're about the infrastructure around the model. Fix the plumbing before blaming the engine.
    `,
    flashQ: "An impressive demo agent fails in production. What's the most likely category of failure?",
    flashA:
      "Infrastructure around the model — usually weak retrieval, poor context packing, missing verification, or no eval suite. Demos show the happy path; production hits every edge case.",
    feynman:
      "Explain why impressive demos often fail in production. Then contrast weak retrieval and weak verification as failure modes. Finally, diagnose a specific failing agent setup using these categories.",
  },
];

export const CATEGORIES = [
  "All",
  ...Array.from(new Set(TOPICS.map((t) => t.category))),
];

export default TOPICS;
