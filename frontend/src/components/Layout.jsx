import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Header with navigation */}
            <Header />
            {/* Main content area that expands to fill available space */}
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
            {/* Footer at bottom of page */}
            <Footer />
        </div>
    );
};

export default Layout;
