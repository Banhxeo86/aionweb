'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUp, ArrowDown, Save, ChevronLeft, RefreshCw } from 'lucide-react';
import styles from './sort.module.css';

const CATEGORIES = [
  { id: 'edu', name: '교육용자료' },
  { id: 'class', name: '학급운영자료' },
  { id: 'work', name: '업무/기타 자료' },
];

export default function SortAdminPage() {
  const [category, setCategory] = useState('edu');
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('관리자 로그인이 필요합니다.');
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const categories = category === 'work' ? ['work', 'etc'] : [category];
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .in('category', categories)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMaterials(data || []);
      } catch (err: any) {
        console.error('Error fetching materials:', err);
        alert('자료를 불러오는데 실패했습니다: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [category, user]);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...materials];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setMaterials(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === materials.length - 1) return;
    const updated = [...materials];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setMaterials(updated);
  };

  const handleSaveOrder = async () => {
    if (materials.length === 0) return;
    setSaving(true);
    try {
      // Supabase supports batch updates via multiple sequential requests or a single RPC.
      // We will perform parallel update promises, which is standard and very fast for smaller lists.
      const promises = materials.map((item, index) => {
        return supabase
          .from('materials')
          .update({ sort_order: index })
          .eq('id', item.id);
      });

      const results = await Promise.all(promises);
      
      // Check if any request failed
      const hasError = results.some(res => res.error);
      if (hasError) {
        const firstError = results.find(res => res.error)?.error;
        throw firstError;
      }

      alert('정렬 순서가 성공적으로 저장되었습니다!');
      router.refresh();
    } catch (err: any) {
      console.error('Error updating sort order:', err);
      alert('순서 저장에 실패했습니다: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div className={`container fade-in ${styles.page}`}>
      <div className={`glass ${styles.sortCard}`}>
        <h1 className={styles.title}>자료 출력 순서 관리</h1>
        <p className={styles.subtitle}>메인 화면과 카테고리 화면에 출력될 자료의 순서를 임의로 변경합니다.</p>

        {/* Categories Tab selector */}
        <div className={styles.tabsContainer}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`${styles.tabBtn} ${category === cat.id ? styles.activeTabBtn : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Materials List */}
        {loading ? (
          <div className={styles.emptyState}>
            <RefreshCw className="animate-spin" size={24} style={{ marginRight: '0.5rem' }} />
            데이터를 불러오는 중입니다...
          </div>
        ) : materials.length === 0 ? (
          <div className={styles.emptyState}>
            이 카테고리에 등록된 자료가 없습니다.
          </div>
        ) : (
          <div className={styles.sortList}>
            {materials.map((item, index) => (
              <div key={item.id} className={styles.sortItem}>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemDesc}>{item.description}</p>
                </div>
                <div className={styles.controls}>
                  <div className={styles.orderBadge}>{index + 1}</div>
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className={styles.arrowBtn}
                    title="위로 이동"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === materials.length - 1}
                    className={styles.arrowBtn}
                    title="아래로 이동"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions Footer */}
        <div className={styles.actions}>
          <Link href="/" className={styles.backBtn}>
            <ChevronLeft size={18} style={{ marginRight: '0.4rem' }} />
            홈으로 돌아가기
          </Link>
          
          <button
            onClick={handleSaveOrder}
            disabled={saving || materials.length === 0}
            className="auth-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.8rem 2.5rem',
            }}
          >
            <Save size={18} />
            {saving ? '저장 중...' : '순서 저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
