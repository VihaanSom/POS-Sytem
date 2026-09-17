import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import BillingSidebar from '../components/dashboard/BillingSidebar';
import MenuView from '../components/dashboard/MenuView';
import OverviewView from '../components/dashboard/OverviewView';
import OrdersView from '../components/dashboard/OrdersView';
import TablesView from '../components/dashboard/TablesView';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import SettingsView from '../components/dashboard/SettingsView';
import CreateOrderModal from '../components/modals/CreateOrderModal';
import AddDishModal from '../components/modals/AddDishModal';
import ReceiptModal from '../components/modals/ReceiptModal';
import Toast from '../components/common/Toast';

export default function DashboardPage({ onNavigate }) {
  const [currentTab, setCurrentTab] = useState('menu');

  return (
    <div className="pos-app">
      {/* 1. LEFT NAVIGATION SIDEBAR */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onExit={() => onNavigate('landing')}
      />

      {/* 2. MAIN CENTER VIEWPORT */}
      <main className="main-viewport">
        <Topbar currentTab={currentTab} />

        <div className="view-content-wrapper">
          {currentTab === 'menu' && <MenuView />}
          {currentTab === 'dashboard' && <OverviewView onSwitchTab={setCurrentTab} />}
          {currentTab === 'orders' && <OrdersView onSwitchTab={setCurrentTab} />}
          {currentTab === 'tables' && <TablesView onSwitchTab={setCurrentTab} />}
          {currentTab === 'analytics' && <AnalyticsView />}
          {currentTab === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* 3. RIGHT BILLING & SUMMARY SIDEBAR */}
      <BillingSidebar />

      {/* 4. MODALS & TOASTS */}
      <CreateOrderModal />
      <AddDishModal />
      <ReceiptModal />
      <Toast />
    </div>
  );
}
