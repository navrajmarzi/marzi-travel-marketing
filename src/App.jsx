import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Hotel, Utensils, Users, Sunset,
  Ship, Fish, CircleDollarSign, Music,
  Building2, Leaf, Wine, ShipWheel,
  Coffee, ShoppingBag, Camera, Bus
} from 'lucide-react'
import './styles.css'

// Generate unique external_id for user tracking
const generateExternalId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Get or create external_id
const getExternalId = () => {
  let externalId = localStorage.getItem('marzi_external_id')
  if (!externalId) {
    externalId = generateExternalId()
    localStorage.setItem('marzi_external_id', externalId)
  }
  return externalId
}

// Get fbc and fbp from cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const trackPageVisit = (pageName) => {
  if (typeof window === 'undefined' || !window.amplitude?.track) return
  window.amplitude.track(pageName)
}

const trackCTA = (ctaName) => {
  if (typeof window === 'undefined' || !window.amplitude?.track) return
  window.amplitude.track(ctaName)
}

// Meta Pixel tracking with advanced matching
const trackMetaEvent = (eventName, userData = {}) => {
  if (typeof window === 'undefined' || !window.fbq) return
  
  const advancedMatching = {
    external_id: getExternalId(),
    country: 'in'
  }
  
  if (userData.name) {
    const nameParts = userData.name.trim().split(' ')
    advancedMatching.fn = nameParts[0]?.toLowerCase()
    if (nameParts.length > 1) {
      advancedMatching.ln = nameParts[nameParts.length - 1]?.toLowerCase()
    }
  }
  
  if (userData.phone) {
    advancedMatching.ph = userData.phone.replace(/\D/g, '')
  }
  
  const fbc = getCookie('_fbc')
  const fbp = getCookie('_fbp')
  if (fbc) advancedMatching.fbc = fbc
  if (fbp) advancedMatching.fbp = fbp
  
  window.fbq('track', eventName, {}, advancedMatching)
}

function App() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [formErrors, setFormErrors] = useState({})
  const [answers, setAnswers] = useState({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const [showPriceAnimation, setShowPriceAnimation] = useState(false)
  const particlesRef = useRef(null)
  const TOTAL_SCREENS = 11

  // Generate particles on mount
  useEffect(() => {
    if (particlesRef.current) {
      for (let i = 0; i < 28; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.cssText = `
          left: ${Math.random() * 100}%;
          width: ${1 + Math.random() * 2.5}px;
          height: ${1 + Math.random() * 2.5}px;
          animation-duration: ${9 + Math.random() * 14}s;
          animation-delay: ${Math.random() * 10}s;
          opacity: ${Math.random() * 0.5};
        `
        particlesRef.current.appendChild(particle)
      }
    }
  }, [])

  useEffect(() => {
    const pageNames = {
      0: 'Landing Page Visit',
      1: 'Page 2 Clicked',
      2: 'Page 3 Clicked',
      3: 'Page 4 Clicked',
      4: 'Page 5 Clicked',
      5: 'Age Question Page',
      6: 'Not Qualified Page',
      8: 'PII Screen',
      9: 'WhatsApp Offer Page',
      10: 'Thank You Page',
    }
    
    if (pageNames[currentScreen]) {
      trackPageVisit(pageNames[currentScreen])
    }
  }, [currentScreen])

  // Generate stars for a container
  const generateStars = (container) => {
    if (!container) return
    for (let i = 0; i < 38; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${2 + Math.random() * 4}s;
        animation-delay: ${Math.random() * 4}s;
        opacity: ${Math.random() * 0.5};
      `
      container.appendChild(star)
    }
  }

  const handleMainCTA = () => {
    setIsFlying(true)
    trackCTA('CTA Clicked: Explore Journey')
    trackMetaEvent('AddToCart')
    setTimeout(() => {
      goToScreen(1)
      setIsFlying(false)
    }, 800)
  }

  const goToScreen = useCallback((toIdx) => {
    if (isTransitioning || toIdx === currentScreen) return
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentScreen(toIdx)
      setIsTransitioning(false)
    }, 450)
  }, [currentScreen, isTransitioning])

  const handleQuizPick = (question, answer) => {
    setAnswers({ ...answers, [question]: answer })
    trackEvent(`Option Selected: ${answer}`)
    
    if (question === 'q1') {
      if (answer === 'under40') {
        goToScreen(6)
      } else {
        goToScreen(8)
      }
    }
  }

  const getAgeRange = () => {
    if (answers.q1 === '50plus') return '50+'
    if (answers.q1 === '40to50') return '40-50'
    return '18-40'
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = true
    }
    
    const phoneDigits = formData.phone.replace(/\D/g, '')
    
    if (!formData.phone || phoneDigits.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit number.'
    } else if (phoneDigits.startsWith('0')) {
      errors.phone = 'Please enter without leading 0.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    const isValid = validateForm()

    if (isValid) {
      setShowPriceAnimation(true)
      
      // Send webhook to n8n
      const now = new Date()
      const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      const formattedDate = `${String(istTime.getDate()).padStart(2, '0')}-${String(istTime.getMonth() + 1).padStart(2, '0')}-${istTime.getFullYear()}`
      const formattedTime = istTime.toLocaleTimeString('en-IN', { hour12: false })
      
      const webhookPayload = {
        submitted_time: `${formattedDate} ${formattedTime}`,
        name: formData.name,
        number: formData.phone,
        age_range: getAgeRange()
      }
      
      try {
        await fetch('https://marzi.app.n8n.cloud/webhook/ads-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        })
      } catch (error) {
        console.error('Webhook error:', error)
      }
      
      setTimeout(() => {
        setShowPriceAnimation(false)
        setTimeout(() => {
          goToScreen(9)
        }, 100)
      }, 2500)
    }
  }

  const handleWhatsAppClick = () => {
    // Track Meta Purchase event only for 50+ age group
    if (answers.q1 === '50plus') {
      trackMetaEvent('Purchase', {
        name: formData.name,
        phone: formData.phone
      })
    }
    
    // Small delay to ensure pixel fires before redirect
    setTimeout(() => {
      const message = encodeURIComponent(`Hi! I'm interested in the Goa Float & Flaunt trip (March 27-30). I'd like to book at the special price of ₹19,999.`)
      window.open(`https://wa.me/918792237778?text=${message}`, '_blank')
    }, 300)
  }

  const firstName = formData.name.split(' ')[0] || 'friend'
  const progressWidth = `${(currentScreen / (TOTAL_SCREENS - 1)) * 100}%`

  // Determine which dots to show (only for day screens 1-4)
  const showDots = currentScreen >= 1 && currentScreen <= 4

  return (
    <>
      {/* Price Animation Overlay */}
      {showPriceAnimation && (
        <div className="price-animation-overlay">
          <div className="price-animation-content">
            <div className="price-old-animated">₹21,999</div>
            <div className="price-arrow-animated">↓</div>
            <div className="price-new-animated">₹19,999</div>
            <div className="price-save-text">You Save ₹2,000!</div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-bar" style={{ width: progressWidth }} />

      {/* Progress Dots - only for day screens */}
      <div className="progress-dots" style={{ opacity: showDots ? 1 : 0 }}>
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className={`progress-dot ${i < currentScreen ? 'done' : ''} ${i === currentScreen ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* ══════════════ SCREEN 0: HERO ══════════════ */}
      <div className={`screen hero-screen ${currentScreen === 0 ? 'active' : ''}`}>
        <div className="hero-bg" />
        <div className="particles-container" ref={particlesRef} />
        <div className="hero-content">
          <img 
            src="https://www.marzi.life/assets/marzi_crop-AKEm9FGI.png" 
            alt="Marzi Holidays" 
            className="hero-logo"
          />
          <div className="hero-title-compact">
            Goa Float & Flaunt
          </div>
          <div className="hero-eligibility-box">
            <div className="eligibility-item">
              <span className="eligibility-icon">📅</span>
              <span className="eligibility-text">27 March</span>
            </div>
            <div className="eligibility-sep">•</div>
            <div className="eligibility-item">
              <span className="eligibility-icon">📍</span>
              <span className="eligibility-text">Bangalore Only</span>
            </div>
          </div>
          
          <div className="hero-trust-box">
            <div className="trust-item">
              <span className="trust-icon">🏥</span>
              <span className="trust-text">24/7 Medical<br/>Support</span>
            </div>
            <div className="trust-sep"></div>
            <div className="trust-item">
              <span className="trust-icon">✨</span>
              <span className="trust-text">Premium<br/>Travel</span>
            </div>
            <div className="trust-sep"></div>
            <div className="trust-item">
              <span className="trust-icon">🌅</span>
              <span className="trust-text">Relaxed<br/>Pace</span>
            </div>
          </div>

          <div className="hero-spacer"></div>

          <div className="hero-price-marker">
            <span className="price-label">₹21,999</span>
            <span className="price-sub">Per Person · All Inclusive</span>
          </div>
          <button className={`btn-main ${isFlying ? 'flying' : ''}`} onClick={handleMainCTA}>
            <span className="btn-text">Explore the Journey →</span>
            <div className="plane-icon">✈️</div>
          </button>
        </div>
      </div>

      {/* ══════════════ SCREEN 1: DAY 1 ══════════════ */}
      <div className={`screen day-screen ${currentScreen === 1 ? 'active' : ''}`}>
        <div className="day-bg day-bg-1" />
        <div className="star-layer" ref={el => el && !el.hasChildNodes() && generateStars(el)} />
        <div className="day-ghost">01</div>
        <div className="day-content anim-child">
          <div className="day-tag">Day 1 · March 27</div>
          <span className="day-emoji">🌅</span>
          <div className="wave-sep" />
          <div className="day-title">Arrival & Casino Night</div>
          <div className="day-mood">"Your Goan escape begins."</div>
          <div className="acts">
            <div className="act">
              <span className="act-num"><Hotel size={18} strokeWidth={1.5} /></span>
              <span className="act-text">3★ Hotel check-in</span>
            </div>
            <div className="act">
              <span className="act-num"><Utensils size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Buffet lunch at hotel</span>
            </div>
            <div className="act">
              <span className="act-num"><CircleDollarSign size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Floating Casino on Mandovi</span>
            </div>
          </div>
          <button className="btn-next" onClick={() => goToScreen(2)}>
            Day 2 awaits &nbsp;→
          </button>
        </div>
      </div>

      {/* ══════════════ SCREEN 2: DAY 2 ══════════════ */}
      <div className={`screen day-screen ${currentScreen === 2 ? 'active' : ''}`}>
        <div className="day-bg day-bg-2" />
        <div className="day-ghost">02</div>
        <div className="day-content anim-child">
          <div className="day-tag">Day 2 · March 28</div>
          <span className="day-emoji">🏖️</span>
          <div className="wave-sep" />
          <div className="day-title">North Goa Discovery</div>
          <div className="day-mood">Beaches, forts & thrilling watersports.</div>
          <div className="acts">
            <div className="act">
              <span className="act-num"><Utensils size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Lunch At Signature Culinary Restaurant</span>
            </div>
            <div className="act">
              <span className="act-num"><Users size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Games For Team Bonding</span>
            </div>
            <div className="act">
              <span className="act-num"><Utensils size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Premium Buffet Dinner</span>
            </div>
          </div>
          <button className="btn-next" onClick={() => goToScreen(3)}>
            Beach Visits (Next Day) &nbsp;→
          </button>
        </div>
      </div>

      {/* ══════════════ SCREEN 3: DAY 3 ══════════════ */}
      <div className={`screen day-screen ${currentScreen === 3 ? 'active' : ''}`}>
        <div className="day-bg day-bg-3" />
        <div className="day-ghost">03</div>
        <div className="day-content anim-child">
          <div className="day-tag">Day 3 · March 29</div>
          <span className="day-emoji">🦚</span>
          <div className="wave-sep" />
          <div className="day-title">South Goa Serenity</div>
          <div className="day-mood">UNESCO sites & luxury cruise.</div>
          <div className="acts">
            <div className="act">
              <span className="act-num"><ShipWheel size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Luxurious Party Cruise</span>
            </div>
            <div className="act">
              <span className="act-num"><Building2 size={18} strokeWidth={1.5} /></span>
              <span className="act-text">UNESCO World Heritage</span>
            </div>
            <div className="act">
              <span className="act-num"><Leaf size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Spice plantation with lunch</span>
            </div>
          </div>
          <button className="btn-next" onClick={() => goToScreen(4)}>
            Cruise Party (Next Day) &nbsp;→
          </button>
        </div>
      </div>

      {/* ══════════════ SCREEN 4: DAY 4 ══════════════ */}
      <div className={`screen day-screen ${currentScreen === 4 ? 'active' : ''}`}>
        <div className="day-bg day-bg-4" />
        <div className="star-layer" ref={el => el && !el.hasChildNodes() && generateStars(el)} />
        <div className="day-ghost">04</div>
        <div className="day-content anim-child">
          <div className="day-tag">Day 4 · March 30</div>
          <span className="day-emoji">👋</span>
          <div className="wave-sep" />
          <div className="day-title">Smooth Departure</div>
          <div className="day-mood">Memories made. Hearts full.</div>
          <div className="acts">
            <div className="act">
              <span className="act-num"><Coffee size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Leisurely breakfast</span>
            </div>
            <div className="act">
              <span className="act-num"><Camera size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Final group photos</span>
            </div>
            <div className="act">
              <span className="act-num"><Bus size={18} strokeWidth={1.5} /></span>
              <span className="act-text">Airport/Station transfer</span>
            </div>
          </div>
          <button className="btn-next" onClick={() => goToScreen(5)}>
            Book This Journey &nbsp;→
          </button>
        </div>
      </div>

      {/* ══════════════ SCREEN 5: Q1 AGE ══════════════ */}
      <div className={`screen quiz-screen ${currentScreen === 5 ? 'active' : ''}`}>
        <div className="quiz-bg" />
        <div className="quiz-inner anim-child">
          <div className="quiz-step">Question 1</div>
          <span className="quiz-emoji">🎂</span>
          <div className="quiz-title">Your age group?</div>
          <div className="quiz-sub">This helps us personalize your experience.</div>
          <div className="options">
            <div 
              className={`option ${answers.q1 === 'under40' ? 'selected' : ''}`}
              onClick={() => handleQuizPick('q1', 'under40')}
            >
              <span className="option-icon">🌱</span>
              18-40 years
              <div className="option-radio" />
            </div>
            <div 
              className={`option ${answers.q1 === '40to50' ? 'selected' : ''}`}
              onClick={() => handleQuizPick('q1', '40to50')}
            >
              <span className="option-icon">🌟</span>
              40-50 years
              <div className="option-radio" />
            </div>
            <div 
              className={`option ${answers.q1 === '50plus' ? 'selected' : ''}`}
              onClick={() => handleQuizPick('q1', '50plus')}
            >
              <span className="option-icon">✨</span>
              50+ years
              <div className="option-radio" />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SCREEN 6: NOT QUALIFIED ══════════════ */}
      <div className={`screen not-qualified ${currentScreen === 6 ? 'active' : ''}`}>
        <div className="quiz-inner anim-child" style={{ textAlign: 'center' }}>
          <span className="quiz-emoji">🌺</span>
          <div className="wave-sep" />
          <div className="quiz-title" style={{ color: 'var(--warm)' }}>
            This trip is for 40+ travellers
          </div>
          <div className="quiz-sub" style={{ color: 'rgba(255,253,248,0.5)' }}>
            We appreciate your interest, but this specific trip is designed for travellers aged 40 and above.
          </div>
        </div>
      </div>

      {/* ══════════════ SCREEN 7: Q2 PRICE ══════════════ */}
      <div className={`screen quiz-screen ${currentScreen === 7 ? 'active' : ''}`}>
        <div className="quiz-bg" />
        <div className="quiz-inner anim-child">
          <div className="quiz-step">Question 2</div>
          <span className="quiz-emoji">💛</span>
          <div className="quiz-title">
            ₹39,999 all-inclusive. Ready?
          </div>
          <div className="quiz-sub">Hotel · Meals · Yacht · Casino · Cruise · Transport.</div>
          <div className="options">
            <div 
              className={`option ${answers.q2 === 'yes' ? 'selected' : ''}`}
              onClick={() => handleQuizPick('q2', 'yes')}
            >
              <span className="option-icon">🙌</span>
              Yes, I'm ready
              <div className="option-radio" />
            </div>
            <div 
              className={`option ${answers.q2 === 'discuss' ? 'selected' : ''}`}
              onClick={() => handleQuizPick('q2', 'discuss')}
            >
              <span className="option-icon">💬</span>
              Tell me more first
              <div className="option-radio" />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SCREEN 8: FORM ══════════════ */}
      <div className={`screen form-screen ${currentScreen === 8 ? 'active' : ''}`}>
        <div className="form-bg" />
        <div className="form-wrap">
          <div className="form-header anim-child">
            <span className="form-header-icon">🌺</span>
            <div className="trip-date-badge">March 27-30, 2026</div>
            <div className="form-title">Reserve Your Seat</div>
            <div className="form-sub">7 spots left</div>
          </div>
          <div className="fields anim-child">
            <div className="field-group">
              <label className="field-label">Your Name</label>
              <input
                type="text"
                className={`field-input ${formErrors.name ? 'error' : ''}`}
                placeholder="e.g. Sunita Mehta"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Phone Number</label>
              <input
                type="tel"
                className={`field-input ${formErrors.phone ? 'error' : ''}`}
                placeholder="e.g. 98765 43210"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 10) {
                    setFormData({ ...formData, phone: value })
                  }
                }}
              />
              {formErrors.phone && <div className="error-text">{formErrors.phone}</div>}
              <div className="no-spam-badge">
                <span className="badge-shield">🔒</span>
                100% No Spam Policy
              </div>
            </div>
            <button className="btn-submit" onClick={handleSubmit}>
              Book This Trip →
            </button>
            <div className="form-privacy">
              🔒 We'll call you within 24 hours
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SCREEN 9: PRICE CUT & WHATSAPP ══════════════ */}
      <div className={`screen price-cut-screen ${currentScreen === 9 ? 'active' : ''}`}>
        <div className="price-cut-wrap anim-child">
          <div className="price-cut-icon">🎉</div>
          <div className="price-cut-title">
            Special Offer Unlocked!
          </div>
          <div className="price-comparison">
            <div className="old-price">₹21,999</div>
            <div className="arrow-down">↓</div>
            <div className="new-price">₹19,999</div>
          </div>
          <div className="price-cut-msg">
            <strong>Save ₹2,000</strong> if you book right now via WhatsApp.
          </div>
          <div className="urgency-text">
            ⏰ Only 7 seats left · Offer expires in 24 hours
          </div>
          <button className="btn-whatsapp" onClick={handleWhatsAppClick}>
            <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Book via WhatsApp
          </button>
          <div className="whatsapp-note">
            Instant confirmation · Secure payment · Personal assistance
          </div>
        </div>
      </div>

      {/* ══════════════ SCREEN 10: THANK YOU ══════════════ */}
      <div className={`screen thankyou-screen ${currentScreen === 10 ? 'active' : ''}`}>
        <div className="thankyou-wrap anim-child">
          <div className="thankyou-circle">🌺</div>
          <div className="thankyou-title">
            Welcome to the family,<br />
            <span className="thankyou-name">{firstName}</span>. ✦
          </div>
          <div className="thankyou-msg">
            We'll call you within 24 hours.
          </div>
          <div className="thankyou-box">
            <div className="thankyou-row">
              <span>Trip</span>
              <strong>Goa Float & Flaunt</strong>
            </div>
            <div className="thankyou-row">
              <span>Dates</span>
              <strong>March 27–30, 2026</strong>
            </div>
            <div className="thankyou-row">
              <span>By</span>
              <strong>Marzi Holidays</strong>
            </div>
            <div className="thankyou-row">
              <span>Status</span>
              <strong className="status-green">🟢 Seat held for you</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
