'use client';
import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Measure TTFB (Time to First Byte)
    const measureTTFB = () => {
      if ('PerformanceNavigationTiming' in window) {
        const navigation =
          performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming;
        const ttfb = navigation.responseStart - navigation.requestStart;
        console.log(`[Performance] TTFB: ${ttfb.toFixed(2)}ms`);
        
        // Send to analytics if needed
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'ttfb', {
            value: Math.round(ttfb),
            metric_name: 'ttfb',
          });
        }
      }
    };

    // Measure LCP (Largest Contentful Paint)
    const measureLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          const lcp = lastEntry.renderTime || lastEntry.loadTime;
          
          console.log(`[Performance] LCP: ${lcp.toFixed(2)}ms`);
          console.log(`[Performance] LCP Element:`, lastEntry.element);
          
          // Send to analytics if needed
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'lcp', {
              value: Math.round(lcp),
              metric_name: 'lcp',
            });
          }
        });

        try {
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observer not supported:', e);
        }
      }
    };

    // Measure FCP (First Contentful Paint)
    const measureFCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              const fcp = entry.startTime;
              console.log(`[Performance] FCP: ${fcp.toFixed(2)}ms`);
              
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'fcp', {
                  value: Math.round(fcp),
                  metric_name: 'fcp',
                });
              }
            }
          });
        });

        try {
          observer.observe({ entryTypes: ['paint'] });
        } catch (e) {
          console.warn('FCP observer not supported:', e);
        }
      }
    };

    // Run measurements
    measureTTFB();
    measureFCP();
    measureLCP();

    // Log all performance metrics
    const logPerformanceMetrics = () => {
      if ('PerformanceNavigationTiming' in window) {
        const navigation =
          performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming;
        
        const metrics = {
          TTFB: navigation.responseStart - navigation.requestStart,
          DOMContentLoaded:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          Load: navigation.loadEventEnd - navigation.loadEventStart,
          DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
          TCP: navigation.connectEnd - navigation.connectStart,
          Request: navigation.responseStart - navigation.requestStart,
          Response: navigation.responseEnd - navigation.responseStart,
        };

        console.table(metrics);
      }
    };

    // Log metrics after page load
    if (document.readyState === 'complete') {
      logPerformanceMetrics();
    } else {
      window.addEventListener('load', logPerformanceMetrics);
    }

    return () => {
      window.removeEventListener('load', logPerformanceMetrics);
    };
  }, []);

  return null; // This component doesn't render anything
}

