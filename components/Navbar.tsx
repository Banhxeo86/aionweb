'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
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
    router.push('/');
    router.refresh();
  };

  return (
    <header className="glass">
      <Link href="/" className="logo">AI-ON</Link>
      <nav className="nav-links">
        <Link href="/materials/edu">교육용자료</Link>
        <Link href="/materials/class">학급운영자료</Link>
        <Link href="/materials/work">업무용자료</Link>
        <Link href="/materials/etc">기타자료</Link>
        <Link href="/about">연구회 소개</Link>
        <Link href="/contact">문의하기</Link>
        {user && <Link href="/admin/upload" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>자료 업로드</Link>}
      </nav>
      <div className="header-actions">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{user.email}님</span>
            <button onClick={handleLogout} className="auth-btn" style={{ background: 'var(--secondary)' }}>로그아웃</button>
          </div>
        ) : (
          <Link href="/login" className="auth-btn">연구회 회원 로그인</Link>
        )}
      </div>
    </header>
  );
}
