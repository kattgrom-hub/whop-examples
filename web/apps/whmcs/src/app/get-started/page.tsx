"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { title: "General", desc: "Tell us a little about you" },
  { title: "Payments", desc: "Choose how you get paid" },
  { title: "Domains", desc: "Enable domain functionality" },
  { title: "Web Hosting", desc: "Connect to your first server" },
  { title: "Add-ons & Extras", desc: "Value added services" },
];

const KYC_STEPS = [
  "Tell us about yourself",
  "Get verified",
  "Additional information",
];

export default function GetStartedPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0=welcome, 1-5=steps, 6=done
  const [kycStep, setKycStep] = useState(0); // 0-2 within step 1

  function handleNext() {
    // If we're on step 1 (General/KYC) and not done with KYC sub-steps
    if (step === 1 && kycStep < 3) {
      setKycStep(kycStep + 1);
      return;
    }
    if (step < 5) {
      setStep(step + 1);
      setKycStep(0);
    } else {
      setStep(6);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  }

  // KYC is "done" when kycStep === 3
  const kycDone = kycStep === 3;

  return (
    <>
      {/* WHMCS Admin Navbar */}
      <div className="whmcs-utilbar">
        <div className="whmcs-utilbar-inner">
          <div className="whmcs-utilbar-links">
            <a href="#">Home</a>
            <span className="whmcs-utilbar-sep">|</span>
            <a href="#">Client Area</a>
            <span className="whmcs-utilbar-sep">|</span>
            <a href="#">My Notes</a>
            <span className="whmcs-utilbar-sep">|</span>
            <a href="#">My Account</a>
            <span className="whmcs-utilbar-sep">|</span>
            <a href="#">Logout</a>
          </div>
          <div className="whmcs-utilbar-date">Monday, 24 July 2017, 17:22</div>
        </div>
      </div>
      <nav className="whmcs-topnav">
        <div className="whmcs-topnav-inner">
          <a href="/" className="whmcs-topnav-logo">
            <img src="/images/logos/whmcs-co-brand-logo.svg" alt="WHMCS" style={{ height: 32, filter: "brightness(10)" }} />
          </a>
          <div className="whmcs-topnav-alerts">
            <span className="whmcs-alert-item whmcs-alert-orange">3 Pending Orders</span>
            <span className="whmcs-alert-sep">|</span>
            <span className="whmcs-alert-item whmcs-alert-red">73 Overdue Invoices</span>
            <span className="whmcs-alert-sep">|</span>
            <span className="whmcs-alert-item whmcs-alert-blue">17 Ticket(s) Awaiting Reply</span>
          </div>
          <div className="whmcs-topnav-search">
            <input type="text" placeholder="" className="whmcs-search-input" />
            <button className="whmcs-search-btn">&#x1F50D;</button>
          </div>
        </div>
        <div className="whmcs-nav-tabs">
          {["Clients", "Orders", "Billing", "Support", "Reports", "Utilities", "Addons", "Setup", "Help"].map(item => (
            <button key={item} className="whmcs-nav-tab">{item}</button>
          ))}
        </div>
      </nav>

      {/* Wizard modal */}
      <div className="wizard-overlay">
        <div className="wizard-modal">
          {/* Wizard header */}
          <div className="wizard-header">
            <span>Getting Started Wizard</span>
            <button className="wizard-close" onClick={() => router.push("/dashboard")}>&times;</button>
          </div>

          <div className="wizard-body">
            {/* Sidebar steps */}
            <div className="wizard-sidebar">
              {STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className={`wizard-step-item ${step > i + 1 || (step === i + 1 && (i > 0 || kycDone)) ? "wizard-step-done" : ""} ${step === i + 1 && !(i === 0 && kycDone) ? "wizard-step-active" : ""}`}
                >
                  <div className="wizard-step-check">
                    {(step > i + 1 || (step === i + 1 && i === 0 && kycDone)) ? (
                      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5.5 10.5L2 7l1-1 2.5 2.5L11 3l1 1z" fill="currentColor"/></svg>
                    ) : (
                      <span className="wizard-step-num">{i + 1}</span>
                    )}
                  </div>
                  <div>
                    <div className="wizard-step-title">{s.title}</div>
                    <div className="wizard-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="wizard-main">
              {step === 0 && (
                <div className="wizard-welcome">
                  <div className="wizard-welcome-icon">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="60" r="16" fill="none" stroke="#7ab648" strokeWidth="3"/>
                      <path d="M40 10 L40 48" stroke="#7ab648" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M30 25 L40 10 L50 25" fill="none" stroke="#7ab648" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="40" cy="38" r="4" fill="#7ab648"/>
                    </svg>
                  </div>
                  <h2 className="wizard-welcome-title">Welcome to WHMCS!</h2>
                  <p className="wizard-welcome-text">
                    In just a few steps you&apos;ll be setup and ready for your first orders.
                  </p>
                  <p className="wizard-welcome-sub">
                    Don&apos;t have time now? You can run this wizard again at any time from the Help menu.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="wizard-content">
                  <h3>Tell us about yourself</h3>
                  <p className="wizard-content-desc">Complete identity verification to enable billing and payouts.</p>

                  {/* Whop annotation */}
                  <div className="whop-annotation" style={{ marginBottom: 16 }}>
                    <div className="whop-annotation-badge">
                      <span className="whop-annotation-dot" />
                      Whop VerifyElement
                    </div>
                    <span className="whop-annotation-desc">Embedded KYC &mdash; this is what Whop provides</span>
                  </div>

                  <div className="wizard-kyc-embed">
                    {/* Progress bar */}
                    <div className="kyc-embed-progress">
                      <div className="kyc-embed-progress-fill" style={{ width: `${((Math.min(kycStep, 3)) / 3) * 100}%` }} />
                    </div>

                    <div className="wizard-kyc-inner">
                      {/* KYC sidebar nav */}
                      <div className="wizard-kyc-nav">
                        {KYC_STEPS.map((label, i) => (
                          <div
                            key={label}
                            className={`wizard-kyc-nav-item ${kycStep === i ? "wizard-kyc-nav-active" : ""} ${kycStep > i ? "wizard-kyc-nav-done" : ""}`}
                          >
                            {kycStep > i ? (
                              <span className="wizard-kyc-nav-check">
                                <svg width="10" height="10" viewBox="0 0 14 14"><path d="M5.5 10.5L2 7l1-1 2.5 2.5L11 3l1 1z" fill="currentColor"/></svg>
                              </span>
                            ) : (
                              <span className={`wizard-kyc-nav-dot ${kycStep === i ? "wizard-kyc-nav-dot-active" : ""}`} />
                            )}
                            <span className={kycStep > i ? "wizard-kyc-nav-strike" : ""}>{label}</span>
                          </div>
                        ))}
                      </div>

                      {/* KYC main content */}
                      <div className="wizard-kyc-form-area">
                        {/* Stage 1: Tell us about yourself */}
                        {kycStep === 0 && (
                          <>
                            <h4>Tell us about yourself</h4>
                            <p className="wizard-kyc-form-desc">Add your name, business type, and address to get started</p>
                            <div className="wizard-form">
                              <div className="wizard-field">
                                <label>Account type</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                  <label className="wizard-radio wizard-radio-selected">
                                    <input type="radio" name="accttype" defaultChecked /> Individual
                                  </label>
                                  <label className="wizard-radio">
                                    <input type="radio" name="accttype" /> Business
                                  </label>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 10 }}>
                                <div className="wizard-field" style={{ flex: 1 }}>
                                  <label>First name</label>
                                  <input defaultValue="Jane" />
                                </div>
                                <div className="wizard-field" style={{ flex: 1 }}>
                                  <label>Last name</label>
                                  <input defaultValue="Smith" />
                                </div>
                              </div>
                              <div className="wizard-field">
                                <label>Country</label>
                                <select><option>United States</option></select>
                              </div>
                              <div className="wizard-field">
                                <label>Address</label>
                                <input defaultValue="123 Main St" />
                              </div>
                              <div style={{ display: "flex", gap: 10 }}>
                                <div className="wizard-field" style={{ flex: 2 }}>
                                  <label>City</label>
                                  <input defaultValue="San Francisco" />
                                </div>
                                <div className="wizard-field" style={{ flex: 1 }}>
                                  <label>State</label>
                                  <input defaultValue="CA" />
                                </div>
                                <div className="wizard-field" style={{ flex: 1 }}>
                                  <label>ZIP</label>
                                  <input defaultValue="94105" />
                                </div>
                              </div>
                              <div className="wizard-field">
                                <label>Date of birth</label>
                                <input type="date" defaultValue="1990-01-15" />
                              </div>
                              <div className="wizard-field">
                                <label>Mobile number</label>
                                <input type="tel" defaultValue="+1 415-555-0123" />
                              </div>
                            </div>
                            <div className="kyc-embed-footer">
                              <button className="kyc-embed-continue" onClick={() => setKycStep(1)}>Continue</button>
                            </div>
                          </>
                        )}

                        {/* Stage 2: Get verified (sandbox bypass) */}
                        {kycStep === 1 && (
                          <>
                            <h4>Get verified</h4>
                            <p className="wizard-kyc-form-desc">Verify your identity to enable payouts</p>
                            <div className="kyc-verify-stage">
                              <div className="kyc-verify-sandbox-card">
                                <div className="kyc-sandbox-badge">SANDBOX</div>
                                <div className="kyc-verify-icon">
                                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <rect x="12" y="8" width="40" height="48" rx="4" stroke="#f0ad4e" strokeWidth="2.5" fill="#fffdf5"/>
                                    <circle cx="32" cy="26" r="8" stroke="#f0ad4e" strokeWidth="2"/>
                                    <rect x="22" y="38" width="20" height="3" rx="1.5" fill="#f0ad4e" opacity="0.5"/>
                                    <rect x="22" y="44" width="14" height="3" rx="1.5" fill="#f0ad4e" opacity="0.5"/>
                                  </svg>
                                </div>
                                <h5>Identity Verification</h5>
                                <p>
                                  In production, the user scans their government-issued ID using <strong>Veriff</strong> and takes a selfie for biometric matching.
                                </p>
                                <p className="kyc-verify-sandbox-hint">
                                  This step is automatically bypassed in sandbox mode.
                                </p>
                                <button className="kyc-verify-bypass-btn" onClick={() => setKycStep(2)}>
                                  Bypass Verification &rarr;
                                </button>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Stage 3: Additional information */}
                        {kycStep === 2 && (
                          <>
                            <h4>Additional information</h4>
                            <p className="wizard-kyc-form-desc">Provide additional details required for compliance</p>
                            <div className="wizard-form">
                              <div className="wizard-field">
                                <label>Website URL</label>
                                <input defaultValue="https://myhosting.com" />
                              </div>
                              <div className="wizard-field">
                                <label>Description of goods/services</label>
                                <textarea className="wizard-textarea" defaultValue="Web hosting, domain registration, and related services for businesses and individuals." />
                              </div>
                            </div>
                            <div className="kyc-embed-footer">
                              <button className="kyc-embed-continue" onClick={() => setKycStep(3)}>Submit</button>
                            </div>
                          </>
                        )}

                        {/* Stage complete */}
                        {kycStep === 3 && (
                          <div className="kyc-embed-complete">
                            <div className="kyc-embed-complete-icon">
                              <svg width="48" height="48" viewBox="0 0 48 48">
                                <circle cx="24" cy="24" r="22" fill="#108ab7"/>
                                <path d="M15 24l6 6 12-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                              </svg>
                            </div>
                            <h4>Verification Complete</h4>
                            <p>Your identity has been verified. You&apos;re ready to accept payments and receive payouts.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="wizard-content">
                  <h3>Payment Configuration</h3>
                  <p className="wizard-content-desc">Set up how you accept payments and receive payouts.</p>
                  <div className="wizard-form">
                    <div className="wizard-field">
                      <label>Payment Gateway</label>
                      <select><option>Stripe</option><option>PayPal</option><option>Authorize.net</option></select>
                    </div>
                    <div className="wizard-field">
                      <label>Default Currency</label>
                      <select><option>USD - US Dollar</option><option>EUR - Euro</option><option>GBP - British Pound</option></select>
                    </div>
                    <div className="wizard-field">
                      <label>Invoice Due Days</label>
                      <input type="number" defaultValue="30" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="wizard-content">
                  <h3>Domain Configuration</h3>
                  <p className="wizard-content-desc">Enable domain registration and management.</p>
                  <div className="wizard-form">
                    <div className="wizard-field">
                      <label>Domain Registrar</label>
                      <select><option>Enom</option><option>ResellerClub</option><option>Namecheap</option></select>
                    </div>
                    <div className="wizard-field">
                      <label>Default Nameserver 1</label>
                      <input defaultValue="ns1.myhosting.com" />
                    </div>
                    <div className="wizard-field">
                      <label>Default Nameserver 2</label>
                      <input defaultValue="ns2.myhosting.com" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="wizard-content">
                  <h3>Web Hosting Setup</h3>
                  <p className="wizard-content-desc">Connect to your first hosting server.</p>
                  <div className="wizard-form">
                    <div className="wizard-field">
                      <label>Server Type</label>
                      <select><option>cPanel/WHM</option><option>Plesk</option><option>DirectAdmin</option></select>
                    </div>
                    <div className="wizard-field">
                      <label>Hostname</label>
                      <input defaultValue="server1.myhosting.com" />
                    </div>
                    <div className="wizard-field">
                      <label>IP Address</label>
                      <input defaultValue="192.168.1.1" />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="wizard-content">
                  <h3>Add-ons &amp; Extras</h3>
                  <p className="wizard-content-desc">Enable value-added services for your clients.</p>
                  <div className="wizard-addons">
                    {[
                      { name: "SSL Certificates", desc: "Offer SSL certificates to your clients" },
                      { name: "Website Builder", desc: "Drag-and-drop website builder integration" },
                      { name: "Email Marketing", desc: "Email campaign tools for clients" },
                      { name: "SEO Tools", desc: "Search engine optimization services" },
                    ].map(addon => (
                      <label key={addon.name} className="wizard-addon-item">
                        <input type="checkbox" defaultChecked />
                        <div>
                          <strong>{addon.name}</strong>
                          <span>{addon.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="wizard-welcome">
                  <div className="wizard-done-icon">&#x2713;</div>
                  <h2 className="wizard-welcome-title" style={{ color: "#7ab648" }}>Setup Complete!</h2>
                  <p className="wizard-welcome-text">
                    Your WHMCS instance is configured. Redirecting to dashboard...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="wizard-footer">
            <div>
              {step === 0 && (
                <a href="/dashboard" className="wizard-skip-link">Do not show this again</a>
              )}
            </div>
            {step < 6 && !(step === 1 && !kycDone) && (
              <button className="wizard-next-btn" onClick={handleNext}>
                {step === 0 ? "Next \u00BB" : step === 5 ? "Finish" : "Next \u00BB"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
