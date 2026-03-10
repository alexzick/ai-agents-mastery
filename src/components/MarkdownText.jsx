/**
 * Lightweight markdown renderer for topic content.
 * Handles: **bold**, *italic*, `code`, - bullet lists, numbered lists, blank-line paragraphs.
 * No external dependencies.
 */
export default function MarkdownText({ text, style = {} }) {
  if (!text) return null;

  const baseStyle = {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.8,
    ...style,
  };

  // Split into paragraphs by double newline
  const blocks = text.split(/\n\n+/);

  return (
    <div style={baseStyle}>
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Check if entire block is a list (every line starts with - or *)
        const lines = trimmed.split("\n");
        const isBulletList = lines.every(
          (l) => /^\s*[-*]\s/.test(l) || !l.trim()
        );
        const isNumberedList = lines.every(
          (l) => /^\s*\d+[.)]\s/.test(l) || !l.trim()
        );

        if (isBulletList) {
          return (
            <ul
              key={bi}
              style={{
                margin: "8px 0",
                paddingLeft: 20,
                listStyleType: "disc",
              }}
            >
              {lines
                .filter((l) => l.trim())
                .map((line, li) => (
                  <li key={li} style={{ marginBottom: 4 }}>
                    <InlineMarkdown
                      text={line.replace(/^\s*[-*]\s/, "")}
                    />
                  </li>
                ))}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol
              key={bi}
              style={{
                margin: "8px 0",
                paddingLeft: 20,
              }}
            >
              {lines
                .filter((l) => l.trim())
                .map((line, li) => (
                  <li key={li} style={{ marginBottom: 4 }}>
                    <InlineMarkdown
                      text={line.replace(/^\s*\d+[.)]\s/, "")}
                    />
                  </li>
                ))}
            </ol>
          );
        }

        // Mixed block: some lines are list items, some aren't
        // Render line by line with inline breaks
        const hasListItems = lines.some((l) => /^\s*[-*]\s/.test(l));
        if (hasListItems) {
          // Group consecutive list items vs paragraphs
          const groups = [];
          let current = { type: null, lines: [] };

          for (const line of lines) {
            const isItem = /^\s*[-*]\s/.test(line);
            const lineType = isItem ? "list" : "text";
            if (lineType !== current.type && current.lines.length > 0) {
              groups.push(current);
              current = { type: lineType, lines: [] };
            }
            current.type = lineType;
            current.lines.push(line);
          }
          if (current.lines.length > 0) groups.push(current);

          return (
            <div key={bi} style={{ margin: "8px 0" }}>
              {groups.map((g, gi) =>
                g.type === "list" ? (
                  <ul
                    key={gi}
                    style={{
                      margin: "4px 0",
                      paddingLeft: 20,
                      listStyleType: "disc",
                    }}
                  >
                    {g.lines
                      .filter((l) => l.trim())
                      .map((line, li) => (
                        <li key={li} style={{ marginBottom: 4 }}>
                          <InlineMarkdown
                            text={line.replace(/^\s*[-*]\s/, "")}
                          />
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p key={gi} style={{ margin: "4px 0" }}>
                    {g.lines.map((line, li) => (
                      <span key={li}>
                        <InlineMarkdown text={line} />
                        {li < g.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                )
              )}
            </div>
          );
        }

        // Plain paragraph — preserve single newlines as <br>
        return (
          <p key={bi} style={{ margin: "8px 0" }}>
            {lines.map((line, li) => (
              <span key={li}>
                <InlineMarkdown text={line} />
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Renders inline markdown: **bold**, *italic*, `code`
 */
function InlineMarkdown({ text }) {
  if (!text) return null;

  // Regex to match **bold**, *italic*, `code` in order
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Find earliest match
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    const matches = [
      boldMatch && { type: "bold", match: boldMatch },
      italicMatch && { type: "italic", match: italicMatch },
      codeMatch && { type: "code", match: codeMatch },
    ]
      .filter(Boolean)
      .sort((a, b) => a.match.index - b.match.index);

    if (matches.length === 0) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const first = matches[0];
    const idx = first.match.index;

    // Text before the match
    if (idx > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    }

    // The styled text
    const content = first.match[1];
    if (first.type === "bold") {
      parts.push(
        <strong key={key++} style={{ color: "#e2e8f0", fontWeight: 600 }}>
          {content}
        </strong>
      );
    } else if (first.type === "italic") {
      parts.push(
        <em key={key++} style={{ color: "#c4b5fd" }}>
          {content}
        </em>
      );
    } else if (first.type === "code") {
      parts.push(
        <code
          key={key++}
          style={{
            background: "#1e293b",
            color: "#64ffda",
            padding: "1px 6px",
            borderRadius: 4,
            fontSize: "0.9em",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {content}
        </code>
      );
    }

    remaining = remaining.slice(idx + first.match[0].length);
  }

  return <>{parts}</>;
}
