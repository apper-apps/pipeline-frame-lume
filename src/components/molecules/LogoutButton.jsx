import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LogoutButton = () => {
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
      className="ml-2"
      title={`Signed in as ${user?.name || user?.email}`}
    >
      <ApperIcon name="LogOut" size={16} className="mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;