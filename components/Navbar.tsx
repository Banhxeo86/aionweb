'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="glass">
      <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)}>AI-ON</Link>
      
      {/* Desktop Navigation */}
      <nav className="nav-links desktop-only">
        <Link href="/materials/edu">교육용자료</Link>
        <Link href="/materials/class">학급운영자료</Link>
        <Link href="/materials/work">업무용자료</Link>
        <Link href="/materials/etc">기타자료</Link>
        <Link href="/about">연구회 소개</Link>
        <Link href="/contact">문의하기</Link>
        {user && <Link href="/admin/upload" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>자료 업로드</Link>}
      </nav>

      <div className="header-actions desktop-only">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{user.email}님</span>
            <button onClick={handleLogout} className="auth-btn" style={{ background: 'var(--secondary)' }}>로그아웃</button>
          </div>
        ) : (
          <Link href="/login" className="auth-btn">연구회 회원 로그인</Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <Link href="/materials/edu" onClick={toggleMenu}>교육용자료</Link>
          <Link href="/materials/class" onClick={toggleMenu}>학급운영자료</Link>
          <Link href="/materials/work" onClick={toggleMenu}>업무용자료</Link>
          <Link href="/materials/etc" onClick={toggleMenu}>기타자료</Link>
          <Link href="/about" onClick={toggleMenu}>연구회 소개</Link>
          <Link href="/contact" onClick={toggleMenu}>문의하기</Link>
          {user && (
            <Link href="/admin/upload" onClick={toggleMenu} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
              자료 업로드
            </Link>
          )}
          
          <div className="mobile-auth-section">
            {user ? (
              <>
                <div className="user-info">
                  <UserIcon size={18} />
                  <span>{user.email}님</span>
                </div>
                <button onClick={handleLogout} className="auth-btn" style={{ width: '100%', background: 'var(--secondary)' }}>
                  <LogOut size={18} /> 로그아웃
                </button>
              </>
            ) : (
              <Link href="/login" className="auth-btn" onClick={toggleMenu} style={{ width: '100%', textAlign: 'center' }}>
                연구회 회원 로그인
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
