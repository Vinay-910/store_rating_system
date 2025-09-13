import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Store, Star, Users, BarChart3, ShoppingBag, UserCheck } from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const Sidebar = () => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    const items = [
      { name: 'Dashboard', href: '/dashboard', icon: Home }
    ];

    if (user?.role === USER_ROLES.SYSTEM_ADMIN) {
      items.push(
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Store Management', href: '/admin/stores', icon: Store },
      );
    }

    if (user?.role === USER_ROLES.NORMAL_USER) {
      items.push(
        { name: 'Stores', href: '/stores', icon: ShoppingBag },
        { name: 'My Ratings', href: '/my-ratings', icon: Star },
      );
    }

    if (user?.role === USER_ROLES.STORE_OWNER) {
      items.push(
        { name: 'Store Ratings', href: '/store-owner/ratings', icon: Star },
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="w-64 bg-gray-50 min-h-screen border-r">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;