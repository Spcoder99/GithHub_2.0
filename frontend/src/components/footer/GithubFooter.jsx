import { Github } from "lucide-react";
import "./GithubFooter.css";

export default function GithubFooter() {
  return (
    <footer className="github-footererosnow">
      <div className="footer-lefterosnow">
        <Github size={18} />
        <span>© 2026 GitHub, Inc.</span>
      </div>

      <ul className="footer-linkserosnow">
        <li>Terms</li>
        <li>Privacy</li>
        <li>Security</li>
        <li>Status</li>
        <li>Community</li>
        <li>Docs</li>
        <li>Contact</li>
        <li>Manage cookies</li>
        <li className="nowraperosnow">Do not share my personal information</li>
      </ul>
    </footer>
    // <div></div>
  );
}
