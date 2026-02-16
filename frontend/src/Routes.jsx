import { useEffect } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import AddFile from "./components/addfile/AddFile";
import AddRead from "./components/addreadMe/AddRead";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateIssuePage from "./components/createissue/CreateIssuePage";
import CreateRepository from "./components/createRepos/CreateRepository";
import Dashboard from "./components/dashboard/Dashboard";
import DeleteAccount from "./components/deleteAccount/DeleteAccount";
import EditFile from "./components/editFile/EditFile";
import EditIssue from "./components/editissue/EditIssue";
import EditProfile from "./components/editProfile/EditProfile";
import GithubFooter from "./components/footer/GithubFooter";
import ForgotPassword from "./components/fPassword/ForgotPassword";
import ResetPassword from "./components/fPassword/ResetPassword";
import ProfilePage from "./components/githubProfile/ProfilePage";
import IssuesPage from "./components/IssuePage";
import RepoIssue from "./components/issueTorepo/RepoIssue";
import RepoFilesPage from "./components/mainprofile/RepoFilesPage";
import MyRepo from "./components/MyRepos/MyRepo";
import Navbar from "./components/Navbar";
import NotificationsPage from "./components/notification/NotificationsPage";
import IssueOpen from "./components/openIssue/IssueOpen";
import SearchEmpty from "./components/pullrequest/SearchEmpty";
import RepoCodePage from "./components/repocode/RepoCodepage";
import StarRepo from "./components/starRepos/StarRepos";
import UpdateRepository from "./components/updateRepo/UpdateRepository";
import GithubFileView from "./components/ViewPage/GithubFileView";
import { useAuth } from "./context/authContext";
import CodespacesPage from "./components/code/CodespacePage";
import SponsorsPage from "./components/sponsers/SponsersPage";
import ProfileSettings from "./components/settings/ProfileSettings";
import MCPServers from "./components/mcpserver/McpServers";
import AppearancePage from "./components/appearances/AppearancePage";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const navigate = useNavigate();

  const location = useLocation(); // ✅ to get current path

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (
      !userIdFromStorage &&
      !["/auth", "/signUp", "/forgotP", "/resetP/:token"].includes(location.pathname)
    ) {
      navigate("/auth");
    }

    if (userIdFromStorage && location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser, location.pathname]);



  let element = useRoutes([
    {path: "/", element: <Dashboard />},
    {path: "/auth", element: <Login />},
    {path: "/signUp", element: <Signup />},
    {path: "/profile", element: <ProfilePage />},
    { path: "/profile/:id", element: <ProfilePage /> },
    { path: "/issues", element: <IssuesPage /> },
    { path: "/createIssue", element: <CreateIssuePage /> },
    { path: "/createRepo", element: <CreateRepository /> },
    { path: "/myrepo", element: <MyRepo /> },
    { path: "/repo/:id/empty", element: <RepoCodePage /> },
    { path: "/repo/:repoId/addfile", element: <AddFile /> },
    { path: "/repo/:repoId/files", element: <RepoFilesPage /> },
    { path: "/repo/:repoId/file/:fileKey", element: <GithubFileView /> },
    { path: "/repo/:repoId/file/:fileKey/edit", element: <EditFile /> },
    { path: "/repo/:repoId/files/readme", element: <AddRead /> },
    { path: "/user/edit", element: <EditProfile /> },
    { path: "/issues/repo/:repoId", element: <RepoIssue /> },
    { path: "/issue/:issueId", element: <IssueOpen /> },
    { path: "/issue/:issueId/edit", element: <EditIssue /> },
    { path: "/starRepos", element: <StarRepo /> },
    { path: "/repo/update/:repoId", element: <UpdateRepository /> },
    { path: "/pullRequest", element: <SearchEmpty /> },
    { path: "/settings/delete", element: <DeleteAccount /> },
    { path: "/notifications", element: <NotificationsPage /> },
    { path: "/forgotP", element: <ForgotPassword /> },
    { path: "/resetP/:token", element: <ResetPassword /> },
    {path: "/codespaces", element: <CodespacesPage />},
    {path: "/sponsors", element: <SponsorsPage />},
    {path: "/settings", element: <ProfileSettings />},
    {path: "/mcpservers", element: <MCPServers />},
    {path: "/appearance", element: <AppearancePage />}

  ])

  const hideLayout = ["/auth", "/signUp", "/forgotP", "/resetP/:token"].includes(
    location.pathname
  );

 
  return (
    <div className="app-container">
      {!hideLayout && <Navbar />}
      <div className="main-content">
        {element}
      </div>

      {!hideLayout && <GithubFooter />}
    </div>
  );

};

export default ProjectRoutes;
