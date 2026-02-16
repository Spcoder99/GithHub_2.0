import {
  AtSign,
  Bookmark,
  Check,
  ChevronDown,
  Eye,
  Inbox,
  MessageCircle,
  Plus,
  Search,
  Target,
  Users
} from "lucide-react";
import "./NotificationsPages.css";

const NotificationsPage = () => {
  return (
    <div className="ghN-wrapperNARENDRA_MODI">

      {/* LEFT SIDEBAR */}
      <aside className="ghN-sidebarNARENDRA_MODI">

        <div className="ghN-menuNARENDRA_MODI">
          <div className="ghN-menu-itemNARENDRA_MODI activeNARENDRA_MODI">
            <Inbox size={16} />
            <span>Inbox</span>
          </div>

          <div className="ghN-menu-itemNARENDRA_MODI">
            <Bookmark size={16} />
            <span>Saved</span>
          </div>

          <div className="ghN-menu-itemNARENDRA_MODI">
            <Check size={16} />
            <span>Done</span>
          </div>
        </div>

        <hr />

        <div className="ghN-filtersNARENDRA_MODI">
          <p className="ghN-filter-titleNARENDRA_MODI">Filters</p>

          <div className="ghN-filter-itemNARENDRA_MODI">
            <Target size={16} />
            Assigned
          </div>

          <div className="ghN-filter-itemNARENDRA_MODI">
            <MessageCircle size={16} />
            Participating
          </div>

          <div className="ghN-filter-itemNARENDRA_MODI">
            <AtSign size={16} />
            Mentioned
          </div>

          <div className="ghN-filter-itemNARENDRA_MODI">
            <Users size={16} />
            Team mentioned
          </div>

          <div className="ghN-filter-itemNARENDRA_MODI">
            <Eye size={16} />
            Review requested
          </div>

          <div className="ghN-filter-itemNARENDRA_MODI">
            <Plus size={16} />
            Add new filter
          </div>
        </div>

        <hr />

        <div className="ghN-manageNARENDRA_MODI">
          Manage notifications <ChevronDown size={14} />
        </div>
      </aside>


      {/* MAIN CONTENT */}
      <main className="ghN-contentNARENDRA_MODI">

        {/* TOP BAR */}
        <div className="ghN-topbarNARENDRA_MODI">

          <div className="ghN-tabsNARENDRA_MODI">
            <button className="ghN-tabNARENDRA_MODI activeNARENDRA_MODI">All</button>
            <button className="ghN-tabNARENDRA_MODI">Unread</button>
          </div>

          <div className="ghN-searchNARENDRA_MODI">
            <Search size={16} />
            <input placeholder="Search notifications" />
          </div>

          <div className="ghN-groupNARENDRA_MODI">
            Group by: Date <ChevronDown size={14} />
          </div>
        </div>

        {/* INFO CARD */}
        <div className="ghN-cardNARENDRA_MODI">
          <div className="ghN-card-leftNARENDRA_MODI">
            <Inbox size={28} />
            <div>
              <h4>Clear out the clutter.</h4>
              <p>
                Get the most out of your new inbox by quickly and easily marking
                all of your previously read notifications as done.
              </p>
            </div>
          </div>

          <div className="ghN-card-actionsNARENDRA_MODI">
            <button className="ghN-btn-secondaryNARENDRA_MODI">Dismiss</button>
            <button className="ghN-btn-primaryNARENDRA_MODI">Get started</button>
          </div>
        </div>

        {/* EMPTY STATE */}
        <div className="ghN-emptyNARENDRA_MODI">
          <img
            src="https://github.githubassets.com/images/modules/notifications/inbox-zero.svg"
            alt="empty"
          />
          <h2>All caught up!</h2>
          <p>Take a break, write some code, do what you do best.</p>
        </div>

      </main>
    </div>
  );
};

export default NotificationsPage;
