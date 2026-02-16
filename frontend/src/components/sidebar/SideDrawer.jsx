import {
  Book,
  CircleDot,
  Compass,
  GitPullRequest,
  Home,
  Laptop,
  LayoutGrid,
  MessageSquare,
  MessageSquareDotIcon,
  Puzzle,
  Search,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import "./sidedrawer.css";

import { Link } from "react-router-dom";

const SideDrawer = ({ open, onClose }) => {

  return (
    <>
      {/* Overlay */}
      <div
        className={`sd-overlayOPOP ${open ? "showOPOP" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`sd-drawerOPOP ${open ? "openOPOP" : ""}`}>
        <div className="sd-headerOPOP">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="github"
          />
          <X size={22} onClick={onClose} className="sd-closeOPOP" />
        </div>

        <nav className="sd-menuOPOP">
          <Link to="/" onClick={onClose} style={{ textDecoration: "none" }}><Item icon={<Home size={18} />} text="Home" /></Link>
          <Link onClick={onClose} style={{ textDecoration: "none" }} to="/issues"><Item icon={<CircleDot size={18} />} text="Issues" /></Link>
          <Link onClick={onClose} style={{textDecoration: "none"}} to="/pullRequest"><Item icon={<GitPullRequest size={18} />} text="Pull requests" /></Link>
          <Item icon={<Book size={18} />} text="Repositories" />
         <Link onClick={onClose} style={{textDecoration: "none"}} to="/notifications"><Item icon={<MessageSquareDotIcon size={18} />} text="Notifications" /></Link> 
          <Item icon={<MessageSquare size={18} />} text="Discussions" />
          <Link onClick={onClose} style={{textDecoration: "none"}} to="/codespaces"><Item icon={<Laptop size={18} />} text="Codespaces" /></Link>
          <Item icon={<Sparkles size={18} />} text="Copilot" />

          <hr />

          <Item icon={<Compass size={18} />} text="Explore" />
          <Item icon={<Store size={18} />} text="Marketplace" />
          <Link onClick={onClose} style={{textDecoration: "none"}} to="/mcpservers"><Item icon={<Puzzle size={18} />} text="MCP registry" /></Link>

          <hr />

          <div className="sd-reposOPOP">
            <div className="sd-repo-headerOPOP">
              <span>Top repositories</span>
              <Search size={18} />
            </div>

            <div className="sd-repoOPOP">
              <span className="sd-dotOPOP" />
              shubhantak_pandey/Github
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

const Item = ({ icon, text }) => (
  <div className="sd-itemOPOP">
    {icon}
    <span>{text}</span>
  </div>
);

export default SideDrawer;
