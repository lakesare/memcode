import { useNavigate, useLocation, useParams } from 'react-router-dom';

// react-router 7 removed withRouter - class components can't use hooks, so we inject
// the v5-shaped props (history/location/match) that our components already expect.
const withRouter = (Component) => (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const history = {
    push: (to, state) => navigate(to, { state }),
    replace: (to, state) => navigate(to, { replace: true, state }),
    go: (delta) => navigate(delta),
    goBack: () => navigate(-1),
    goForward: () => navigate(1)
  };

  return <Component {...props} history={history} location={location} match={{ params }}/>;
};

export default withRouter;
