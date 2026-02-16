import "./terminalLoader.css";

export default function TerminalLoader() {
  return (
    <div className="loader-overlayNORA_FATEHI">   {/* ✅ NEW */}
      <div className="terminal-loaderNORA_FATEHI">
        <div className="terminal-headerNORA_FATEHI">
          <div className="terminal-titleNORA_FATEHI">Status</div>
          <div className="terminal-controlsNORA_FATEHI">
            <div className="controlNORA_FATEHI closeNORA_FATEHI"></div>
            <div className="controlNORA_FATEHI minimizeNORA_FATEHI"></div>
            <div className="controlNORA_FATEHI maximizeNORA_FATEHI"></div>
          </div>
        </div>

        <div className="textNORA_FATEHI">Loading...</div>
      </div>
    </div>
  );
}
