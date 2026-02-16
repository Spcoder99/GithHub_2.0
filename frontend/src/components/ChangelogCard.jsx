import "./changelog.css";

const changelog = [
  {
    time: "13 hours ago",
    text: "Showing tool calls and other improvements to Copilot cha...",
  },
  {
    time: "14 hours ago",
    text: "GitHub Copilot in Visual Studio Code v1.109 – January Release",
  },
  {
    time: "14 hours ago",
    text: "GitHub Copilot in Visual Studio — January update",
  },
  {
    time: "15 hours ago",
    text: "Claude and Codex are now available in public preview on...",
  },
  {
    time: "19 hours ago",
    text: "Deep learning model is now available in public preview on...",
  },
  {
    time: "25 hours ago",
    text: "Open AI API key is now required to use GitHub Copilot. More dummy text here to show how wrapping works for longer changelog entries.",
  },
];

const ChangelogCard = () => (
  <div className="changelog-cardRAJU_RASHMI">
    <h3 className="changelog-titleRAJU_RASHMI">Latest from our changelog</h3>
    <ul className="changelog-listRAJU_RASHMI">
      {changelog.map((item, idx) => (
        <li className="changelog-itemRAJU_RASHMI" key={idx}>
          <span className="changelog-dotRAJU_RASHMI" />
          <div className="changelog-contentRAJU_RASHMI">
            <span className="changelog-timeRAJU_RASHMI">{item.time}</span>
            <span className="changelog-textRAJU_RASHMI">{item.text}</span>
          </div>
        </li>
      ))}
    </ul>
    <a href="#" className="changelog-linkRAJU_RASHMI">View changelog →</a>
  </div>
);

export default ChangelogCard;