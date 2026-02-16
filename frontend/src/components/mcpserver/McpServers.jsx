import React from "react";
import {
  Search,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Server
} from "lucide-react";
import "./MCPServers.css";

const servers = [
  { name: "Markitdown", desc: "Convert various file formats (PDF, Word, Excel, images, audio) to Markdown.", author: "microsoft", stars: "87,108" },
  { name: "Netdata MCP Server", desc: "Real-time infrastructure monitoring with metrics, logs, alerts, and ML-based anomaly detection.", author: "netdata", stars: "77,747" },
  { name: "Context7", desc: "Up-to-date code docs for any prompt", author: "upstash", stars: "45,781" },
  { name: "Playwright", desc: "Automate web browsers using accessibility trees for testing and data extraction.", author: "microsoft", stars: "27,167" },
  { name: "GitHub", desc: "Connect AI assistants to GitHub - manage repos, issues, PRs, and workflows.", author: "github", stars: "26,943" },
  { name: "Chrome DevTools MCP", desc: "MCP server for Chrome DevTools", author: "ChromeDevTools", stars: "25,237" },
  { name: "Serena", desc: "Semantic code retrieval & editing tools for coding agents.", author: "oraisos", stars: "20,232" },
  { name: "Unity", desc: "Control the Unity Editor from MCP clients via a Unity bridge + local Python server.", author: "CoplayDev", stars: "5,955" },
  { name: "Firecrawl", desc: "Extract web data with Firecrawl", author: "firecrawl", stars: "5,502" }
];

const McpServers = () => {
  return (
    <div className="mcp-wrapper">

      {/* HERO */}
      <div className="mcp-hero">
        <div className="mcp-logo">
          <Server size={28}/>
        </div>
        <h1>Connect models to the real world</h1>
        <p>
          Servers and tools from the community that connect models to files,
          APIs, databases, and more.
        </p>

        <div className="mcp-search">
          <input placeholder="Search MCPs" />
          <Search size={18}/>
        </div>
      </div>

      {/* LIST TITLE */}
      <div className="mcp-list-header">
        <h3>All MCP servers</h3>
        <span className="mcp-count">80</span>
      </div>

      {/* GRID */}
      <div className="mcp-grid">
        {servers.map((item, index) => (
          <div className="mcp-card" key={index}>

            <div className="mcp-card-top">
              <div className="mcp-card-title">
                <div className="mcp-icon"></div>
                <h4>{item.name}</h4>
              </div>

              <button className="mcp-install-btn">
                Install <ChevronDown size={14}/>
              </button>
            </div>

            <p className="mcp-desc">{item.desc}</p>

            <div className="mcp-meta">
              <span>By {item.author}</span>
              <span className="mcp-stars">
                <Star size={14}/> {item.stars}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mcp-pagination">
        <span><ChevronLeft size={14}/> Previous</span>
        <span className="active">1</span>
        <span>2</span>
        <span>3</span>
        <span>Next <ChevronRight size={14}/></span>
      </div>

    </div>
  );
};

export default McpServers;
