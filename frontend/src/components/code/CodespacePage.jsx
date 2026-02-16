import React from "react";
import {
  LayoutGrid,
  FileText,
  Plus,
  CheckCircle2,
  BookOpen,
  Code2,
  Atom,
  Notebook,
  Code
} from "lucide-react";
import "./CodespacesPage.css";

const CodespacesPage = () => {
  return (
    <div className="ghC-wrapper">

      {/* SIDEBAR */}
      <aside className="ghC-sidebar">
        <div className="ghC-side-item active">
          <LayoutGrid size={16} />
          <span>All</span>
          <span className="ghC-badge">0</span>
        </div>

        <div className="ghC-side-item">
          <FileText size={16} />
          <span>Templates</span>
        </div>
      </aside>


      {/* MAIN */}
      <main className="ghC-content">

        {/* HEADER */}
        <div className="ghC-header">
          <div>
            <h1>Your instant dev environment</h1>
            <p>Go from code to commit faster on any project.</p>
          </div>

          <div className="ghC-header-actions">
            <button className="ghC-btn-secondary">Go to docs</button>
            <button className="ghC-btn-primary">
              <Plus size={16} /> New codespace
            </button>
          </div>
        </div>

        {/* TEMPLATES SECTION */}
        <div className="ghC-section">

          <div className="ghC-section-header">
            <h3>Explore quick start templates</h3>
            <span className="ghC-see">See all</span>
          </div>

          <div className="ghC-templates">

            <div className="ghC-card">
              <div className="ghC-icon-circle">
                <Plus size={22} />
              </div>
              <h4>Blank</h4>
              <span className="ghC-by">By github <CheckCircle2 size={14} /></span>
              <p>Start with a blank canvas or import any packages you need.</p>
              <button className="ghC-btn-outline">Use this template</button>
            </div>

            <div className="ghC-card">
              <div className="ghC-icon-circle">
                <Atom size={22} />
              </div>
              <h4>React</h4>
              <span className="ghC-by">By github <CheckCircle2 size={14} /></span>
              <p>A popular JavaScript library for building user interfaces based on UI components.</p>
              <button className="ghC-btn-outline">Use this template</button>
            </div>

            <div className="ghC-card">
              <div className="ghC-icon-circle">
                <Notebook size={22} />
              </div>
              <h4>Jupyter Notebook</h4>
              <span className="ghC-by">By github <CheckCircle2 size={14} /></span>
              <p>JupyterLab is the latest web-based interactive development environment for notebooks, code, and data.</p>
              <button className="ghC-btn-outline">Use this template</button>
            </div>

            <div className="ghC-card">
              <div className="ghC-icon-circle">
                <Code size={22} />
              </div>
              <h4>.NET</h4>
              <span className="ghC-by">By github <CheckCircle2 size={14} /></span>
              <p>A full-stack web application template written in C#.</p>
              <button className="ghC-btn-outline">Use this template</button>
            </div>

          </div>
        </div>

        {/* GETTING STARTED */}
        <div className="ghC-getting">

          <h2>Getting started with GitHub Codespaces</h2>

          <div className="ghC-getting-grid">

            <div className="ghC-get-card">
              <h4>Learn core concepts</h4>
              <p>New to Codespaces? <a>Start here</a>. Learn the core concepts and how to get started.</p>
            </div>

            <div className="ghC-get-card">
              <h4>Configure and manage</h4>
              <p>Learn more about features like <a>secret management</a> and <a>port forwarding</a>.</p>
            </div>

            <div className="ghC-get-card">
              <h4>Develop locally</h4>
              <p>Access codespaces from within <a>Visual Studio Code</a>.</p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default CodespacesPage;
