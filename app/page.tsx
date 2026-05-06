'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const CATEGORIES = [
  { id: 'edu', title: '교육용자료' },
  { id: 'class', title: '학급운영자료' },
  { id: 'work', title: '업무용자료' },
  { id: 'etc', title: '기타자료' },
];

function MaterialSlider({ category, title }: { category: string, title: string }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data } = await supabase
          .from('materials')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false });

        // If no data, use some sample data for demonstration
        if (!data || data.length === 0) {
          setMaterials([
            { id: 1, title: `${title} 샘플 1`, description: '등록된 자료가 없습니다. 관리자 페이지에서 자료를 등록해 주세요.', link_url: '#' },
            { id: 1, title: `${title} 가이드북`, description: '효율적인 수업을 위한 필수 가이드라인과 매뉴얼입니다.', link_url: '#' },
            { id: 2, title: `${title} 템플릿`, description: '복잡한 업무를 간편하게 처리할 수 있는 문서 양식입니다.', link_url: '#' },
            { id: 3, title: `${title} 활용 사례`, description: '선생님들이 실제로 적용한 생생한 성공 사례 공유.', link_url: '#' },
          ]);
        } else {
          setMaterials(data);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [category, title]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      
      let scrollTo;
      if (direction === 'left') {
        // 맨 앞에 도달했을 때 왼쪽을 누르면 맨 끝으로 이동
        if (scrollLeft <= 10) {
          scrollTo = scrollWidth;
        } else {
          scrollTo = scrollLeft - scrollAmount;
        }
      } else {
        // 맨 끝에 도달했을 때 오른쪽을 누르면 맨 앞으로 이동
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollTo = 0;
        } else {
          scrollTo = scrollLeft + scrollAmount;
        }
      }
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.categorySection}>
      <div className="container">
        <h2 className={styles.categoryTitle}>{title}</h2>
        <div className={styles.sliderWrapper}>
          <button onClick={() => scroll('left')} className={`${styles.sliderBtn} ${styles.prevBtn}`}>
            <ChevronLeft size={24} />
          </button>

          <div className={styles.sliderContainer} ref={scrollRef}>
            {materials.map((item) => (
              <Link
                key={item.id}
                href={`/materials/detail/${item.id}`}
                className={`glass ${styles.squareCard}`}
              >
                <div className={styles.cardImage}>
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt={item.title} className={styles.thumbnail} />
                  ) : (
                    <div className={styles.thumbnailPlaceholder}>
                      <span>{title.split('자료')[0]}</span>
                    </div>
                  )}
                  <div className={styles.categoryBadgeOverlay}>{title.split('자료')[0]}</div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.viewMore}>자세히 보기 →</span>
                </div>
              </Link>
            ))}
          </div>

          <button onClick={() => scroll('right')} className={`${styles.sliderBtn} ${styles.nextBtn}`}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="fade-in">
      {/* Hero Section - Fixed Overlap and Improved Resolution */}
      <section className={styles.heroWrapper}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: 'url(/images/hero_premium.png)' }}
        >
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>AI-ON</h1>
            <p className={styles.heroSubtitle}>AI로 교육을 밝히다</p>
          </div>
        </div>
      </section>

      {/* Materials by Category */}
      <div className={styles.materialsMain}>
        {CATEGORIES.map((cat) => (
          <MaterialSlider key={cat.id} category={cat.id} title={cat.title} />
        ))}
      </div>
    </div>
  );
}
