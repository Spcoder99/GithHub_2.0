import {
  Check,
  ChevronDown,
  Circle,
  GitBranch,
  Lightbulb,
  Search
} from "lucide-react";
import "./SearchEmpty.css";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const SearchEmpty = () => {

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/userProfile/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to fetch user");
        console.log(error.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (userId) fetchUser();

  }, [userId]);

  return (
    <>
      {/* <Navbar/> */}
      <div className="gh-wrapperCHUTH_MANANI_KA">
        {/* Top Filters */}
        <div className="gh-topbarCHUTH_MANANI_KA">
          <div className="gh-tabsCHUTH_MANANI_KA">
            <button className="gh-tabCHUTH_MANANI_KA activeCHUTH_MANANI_KA">Created</button>
            <button className="gh-tabCHUTH_MANANI_KA">Assigned</button>
            <button className="gh-tabCHUTH_MANANI_KA">Mentioned</button>
            <button className="gh-tabCHUTH_MANANI_KA">Review requests</button>
          </div>

          <div className="gh-searchCHUTH_MANANI_KA">
            <Search size={16} />
            <input
              value={`is:open is:pr author:${user?.user?.username} archived:false`}
              readOnly
            />
          </div>
        </div>

        {/* Result Box */}
        <div className="gh-boxCHUTH_MANANI_KA">
          <div className="gh-box-headerCHUTH_MANANI_KA">
            <div className="gh-statusCHUTH_MANANI_KA">
              <GitBranch size={16} />
              <span>0 Open</span>

              <Check size={16} className="closed-iconCHUTH_MANANI_KA" />
              <span>0 Closed</span>
            </div>

            <div className="gh-sortCHUTH_MANANI_KA">
              <span>
                Visibility <ChevronDown size={14} />
              </span>
              <span>
                Organization <ChevronDown size={14} />
              </span>
              <span>
                Sort <ChevronDown size={14} />
              </span>
            </div>
          </div>

          <div className="gh-emptyCHUTH_MANANI_KA">
            <Circle size={24} />
            <h2>No results matched your search.</h2>
            <p>
              You could search <a>all of GitHub</a> or try an{" "}
              <a>advanced search</a>.
            </p>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="gh-protipCHUTH_MANANI_KA">
          <Lightbulb size={16} />
          <span>
            <strong>ProTip!</strong> Exclude everything labeled{" "}
            <span className="gh-badgeCHUTH_MANANI_KA">bug</span> with{" "}
            <a>-label:bug</a>.
          </span>
        </div>

        {/* Footer */}
        
      </div>
    </>
  );
};

export default SearchEmpty;
