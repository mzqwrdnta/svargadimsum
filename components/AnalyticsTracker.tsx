'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Generate simple UUID for visitor and session IDs
    const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let visitorId = localStorage.getItem('svarga_visitor_id');
    if (!visitorId) {
      visitorId = generateId();
      localStorage.setItem('svarga_visitor_id', visitorId);
    }

    let sessionId = sessionStorage.getItem('svarga_session_id');
    if (!sessionId) {
      sessionId = generateId();
      sessionStorage.setItem('svarga_session_id', sessionId);
    }

    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
      return 'desktop';
    };

    const payload = {
      page_path: pathname,
      referrer: document.referrer,
      visitor_id: visitorId,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      device_type: getDeviceType(),
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
    };

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('Failed to track analytics:', err));

  }, [pathname]);

  return null;
}
