import React from 'react';
import Header from './Header/Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
};

export default Layout;
