"use client";
import { useEffect, useState } from "react";
import { CrisisResponse } from "@/types";

interface DoneScreenProps {
  crisis: CrisisResponse;
  onReset: () => void;
}

export default function DoneScreen({ crisis, onReset }: DoneScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Stagger mount for entry animations
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .done-root {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          background: #060b12;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px 60px;
        }

        /* ── animated mesh background ── */
        .done-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }
        .done-bg::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 70%;
          height: 70%;
          background: radial-gradient(ellipse, rgba(16,185,129,0.13) 0%, transparent 65%);
          animation: driftA 12s ease-in-out infinite alternate;
        }
        .done-bg::after {
          content: '';
          position: absolute;
          bottom: -20%;
          right: -15%;
          width: 60%;
          height: 60%;
          background: radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 65%);
          animation: driftB 15s ease-in-out infinite alternate;
        }
        .done-bg-mid {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 65%);
          animation: driftC 18s ease-in-out infinite alternate;
        }

        @keyframes driftA {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(5%, 8%) scale(1.08); }
        }
        @keyframes driftB {
          from { transform: translate(0, 0) scale(1.05); }
          to   { transform: translate(-6%, -5%) scale(1); }
        }
        @keyframes driftC {
          from { transform: translate(-50%, -50%) scale(1); }
          to   { transform: translate(-50%, -50%) scale(1.15); }
        }

        /* ── content wrapper ── */
        .done-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 580px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .done-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── hero ── */
        .done-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          padding-top: 8px;
        }

        /* orbiting ring icon */
        .done-icon-wrap {
          position: relative;
          width: 96px;
          height: 96px;
        }
        .done-icon-ring {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 1.5px solid rgba(52,211,153,0.25);
          animation: spinRing 8s linear infinite;
        }
        .done-icon-ring::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 12px #34d399;
        }
        .done-icon-ring2 {
          position: absolute;
          inset: -24px;
          border-radius: 50%;
          border: 1px solid rgba(52,211,153,0.1);
          animation: spinRing 14s linear infinite reverse;
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .done-icon-core {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(16,185,129,0.25), rgba(52,211,153,0.1));
          border: 1.5px solid rgba(52,211,153,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          backdrop-filter: blur(8px);
          box-shadow: 0 0 40px rgba(52,211,153,0.2), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .done-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 400;
          line-height: 1.15;
          color: #f0fdf4;
          letter-spacing: -0.02em;
        }
        .done-title em {
          font-style: italic;
          color: #34d399;
        }
        .done-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.38);
          line-height: 1.7;
          max-width: 340px;
          font-weight: 300;
        }

        /* ── stat pills ── */
        .done-stats {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .done-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 40px;
          border: 1px solid rgba(52,211,153,0.2);
          background: rgba(52,211,153,0.06);
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          font-weight: 400;
        }
        .done-stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px #34d399;
          flex-shrink: 0;
        }

        /* ── steps section ── */
        .done-steps-label {
          font-size: 10px;
          color: rgba(255,255,255,0.22);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          text-align: center;
        }
        .done-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 10px;
        }
        .done-step-card {
          position: relative;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.025);
          padding: 14px 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          transition: border-color 0.2s, background 0.2s;
          opacity: 0;
          transform: translateY(10px);
          animation: stepIn 0.4s ease forwards;
        }
        .done-step-card:hover {
          border-color: rgba(52,211,153,0.25);
          background: rgba(52,211,153,0.04);
        }

        @keyframes stepIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .done-step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #34d399;
          font-weight: 500;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .done-step-label {
          font-size: 10px;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 3px;
        }
        .done-step-action {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.82);
          line-height: 1.4;
        }

        /* ── encouragement card ── */
        .done-encouragement {
          border-radius: 20px;
          border: 1px solid rgba(52,211,153,0.15);
          background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(56,189,248,0.05));
          padding: 28px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .done-encouragement::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent);
        }
        .done-encouragement-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 40px;
          border: 1px solid rgba(52,211,153,0.25);
          background: rgba(52,211,153,0.08);
          font-size: 11px;
          color: #6ee7b7;
          margin-bottom: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
        }
        .done-encouragement-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #f0fdf4;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .done-encouragement-body {
          font-size: 13.5px;
          color: rgba(255,255,255,0.38);
          line-height: 1.75;
          max-width: 340px;
          margin: 0 auto;
          font-weight: 300;
        }

        /* ── buttons ── */
        .done-actions {
          display: flex;
          gap: 12px;
        }
        .done-btn-primary {
          flex: 1;
          padding: 15px 20px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 24px rgba(16,185,129,0.3);
          letter-spacing: 0.01em;
        }
        .done-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
        }
        .done-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(16,185,129,0.4);
        }
        .done-btn-primary:active { transform: scale(0.98); }

        .done-btn-secondary {
          flex: 1;
          padding: 15px 20px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          font-weight: 400;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          letter-spacing: 0.01em;
        }
        .done-btn-secondary:hover {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.65);
        }
      `}</style>

      <div className="done-root">
        {/* mesh background */}
        <div className="done-bg">
          <div className="done-bg-mid" />
        </div>

        <div className={`done-content ${mounted ? "visible" : ""}`}>
          {/* ── HERO ── */}
          <div className="done-hero">
            <div className="done-icon-wrap">
              <div className="done-icon-ring2" />
              <div className="done-icon-ring" />
              <div className="done-icon-core">✦</div>
            </div>

            <div>
              <h1 className="done-title">
                You made it
                <br />
                <em>through.</em>
              </h1>
            </div>

            <p className="done-subtitle">
              Every step you completed took courage. Take a breath — you handled
              this.
            </p>

            {/* stat pills */}
            <div className="done-stats">
              <div className="done-stat">
                <span className="done-stat-dot" />
                {crisis.steps.length} steps completed
              </div>
              <div className="done-stat">
                <span className="done-stat-dot" />
                Crisis managed
              </div>
              <div className="done-stat">
                <span className="done-stat-dot" />
                You did this
              </div>
            </div>
          </div>

          {/* ── STEPS ── */}
          <div>
            <p className="done-steps-label" style={{ marginBottom: 14 }}>
              What you completed
            </p>
            <div className="done-steps-grid">
              {crisis.steps.map((step, i) => (
                <div
                  key={i}
                  className="done-step-card"
                  style={{ animationDelay: `${0.1 + i * 0.07}s` }}
                >
                  <div className="done-step-num">✓</div>
                  <div>
                    <p className="done-step-label">Step {i + 1}</p>
                    <p className="done-step-action">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ENCOURAGEMENT ── */}
          <div className="done-encouragement">
            <div className="done-encouragement-badge">✦ &nbsp;Well done</div>
            <h3 className="done-encouragement-title">
              Strength looks like this.
            </h3>
            <p className="done-encouragement-body">
              Reaching out and following through when things feel hardest is one
              of the bravest things a person can do. You are not alone — support
              is always here.
            </p>
          </div>

          {/* ── ACTIONS ── */}
          <div className="done-actions">
            <button className="done-btn-primary" onClick={onReset}>
              Start Over
            </button>
            <button
              className="done-btn-secondary"
              onClick={() => window.location.reload()}
            >
              Close App
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
