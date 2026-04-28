'use client';

import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <div className={`container fade-in ${styles.page}`}>
      <section className={styles.header}>
        <h1 className={styles.title}>AI-ON 연구회 문의</h1>
        <p className={styles.subtitle}>미래 교육을 선도하는 AI-ON과 함께하세요.</p>
      </section>

      <div className={styles.contentGrid}>
        <div className={`glass ${styles.infoCard}`}>
          <h2>✉️ 문의 방법</h2>
          <p>연구회 활동 참여, 자료 공유, 협업 요청 등 다양한 문의를 환영합니다.</p>
          <div className={styles.contactItem}>
            <strong>이메일</strong>
            <span>support@ai-on.org</span>
          </div>
          <div className={styles.contactItem}>
            <strong>카카오톡 채널</strong>
            <span>@AI-ON_Official</span>
          </div>
          <div className={styles.contactItem}>
            <strong>인스타그램</strong>
            <span>@aion_edu</span>
          </div>
          <a 
            href="https://open.kakao.com/o/p6phjJri" 
            target="_blank" 
            rel="noopener noreferrer"
            className="auth-btn" 
            style={{ marginTop: '2rem', width: '100%', display: 'block', textAlign: 'center' }}
          >
            CONTACT US
          </a>
        </div>
      </div>
    </div>
  );
}
