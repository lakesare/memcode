import { Link } from 'react-router';

class NavigationAdmin extends React.Component {
  render = () =>
    <nav className="navigation-admin">
      <Link activeClassName="active" to="/admin/notifications">Notifications</Link>
      <Link activeClassName="active" to="/admin/eeelse">Something else</Link>
    </nav>
}

export default NavigationAdmin;
