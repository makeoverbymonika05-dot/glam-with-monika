import { useState, useEffect } from 'react'
import { Instagram, Phone, MapPin, Star, Sparkles, ShoppingBag, Menu, X, Edit2, LogIn, Save, LogOut, Camera, Trash2, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const DEFAULT_CONTENT = {
  header: {
    logo: '/logo.png'
  },
  hero: {
    tagline: 'Elevating Your Natural Beauty',
    description: 'Professional Makeup Artist & Hairstylist with 5+ years of experience. Specializing in soft, natural, and elegant bridal glam.',
    price: '₹3,999',
    image: '/hero.png',
    pdfUrl: '#'
  },
  about: {
    title: 'The Art of Beauty',
    p1: 'I am a professional makeup artist and hairstylist with over 5 years of experience, specializing in soft, natural, and elegant bridal glam.',
    p2: 'My artistry focuses on glowing skin, timeless beauty, and enhancing your natural features — so you still look like YOU, just elevated.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop'
  },
  contact: {
    instagram: '@makeoverby__monika',
    email: 'makeoverbymonika05@gmail.com'
  },
  pricing: [
    { name: 'Haldi Soft Glam', price: '₹3,999', details: ['Dewy lightweight base', 'Fresh soft blush & glow', 'Hairstyle', 'Lashes and lenses included'] },
    { name: 'Mehendi Glam', price: '₹4,999', details: ['Soft glam eyes', 'Skin-like HD base', 'Hairstyle', 'Lashes included'] },
    { name: 'Sangeet / Cocktail', price: '₹6,999', details: ['Soft-glam', 'Lenses and lashes included', 'Hairstyle', 'Body glow + soft glitter touch'] }
  ],
  bridal: [
    { name: 'Soft Glam Bridal', price: '₹9,999' },
    { name: 'HD Glow Bridal', price: '₹12,999' },
    { name: 'Airbrush Luxury Bridal', price: '₹14,999' }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=2080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526045478516-99145907023c?q=80&w=2080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=2080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2080&auto=format&fit=crop'
  ],
  hamper: {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop'
  },
  testimonials: [
    { name: 'Sonal Singh', comment: 'Amazing experience! Loved the look. Monika is very professional.', rating: 5 },
    { name: 'Priya Verma', comment: 'Highly recommended for bridal makeup. My skin looked flawless.', rating: 5 },
    { name: 'Riya Jha', comment: 'The best makeup artist in Jabalpur. So happy with the results!', rating: 5 }
  ],
  socials: {
    whatsapp: 'https://wa.link/yp0ma5',
    instagram: 'https://www.instagram.com/makeoverby__monika?igsh=ZG1jMHNhZXoyYnE5',
    gmail: 'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox'
  }
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [tempContent, setTempContent] = useState(DEFAULT_CONTENT)
  const [adminTab, setAdminTab] = useState('content') // 'content' or 'media'
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    service: 'Select a service / package...',
    query: ''
  })
  const [isSending, setIsSending] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // { type: 'success' | 'error', message: string }
  const [feedbackForm, setFeedbackForm] = useState({ name: '', rating: 5, message: '' })
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const [feedbackStatus, setFeedbackStatus] = useState(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'content', 'main_website')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const parsed = docSnap.data()
          // Merge saved content with DEFAULT_CONTENT to ensure new keys are present
          const merged = {
            ...DEFAULT_CONTENT,
            ...parsed,
            header: { ...DEFAULT_CONTENT.header, ...parsed.header },
            hero: { ...DEFAULT_CONTENT.hero, ...parsed.hero },
            about: { ...DEFAULT_CONTENT.about, ...parsed.about },
            contact: { ...DEFAULT_CONTENT.contact, ...parsed.contact },
            hamper: { ...DEFAULT_CONTENT.hamper, ...parsed.hamper },
            gallery: parsed.gallery || DEFAULT_CONTENT.gallery,
            testimonials: parsed.testimonials || DEFAULT_CONTENT.testimonials,
            socials: { ...DEFAULT_CONTENT.socials, ...parsed.socials }
          }
          setContent(merged)
          setTempContent(merged)
        }
      } catch (error) {
        console.error("Error fetching content from Firestore:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'monika@' && password === 'monika@1763') {
      setIsLoggedIn(true)
      setShowLogin(false)
      setUsername('')
      setPassword('')
    } else {
      alert('Incorrect username or password')
    }
  }

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'content', 'main_website')
      await setDoc(docRef, tempContent)
      setContent(tempContent)
      setIsLoggedIn(false)
      alert('Changes saved successfully! Everyone can now see them live.')
    } catch (error) {
      console.error("Error saving to Firestore:", error)
      alert("Failed to save changes to the live database.")
    }
  }

  const getDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return url
    if (url.includes('drive.google.com')) {
      const dMatch = url.match(/\/d\/([^/?#\s]+)/)
      let id = ''
      if (dMatch) id = dMatch[1]
      else {
        const idParamMatch = url.match(/[?&]id=([^&#\s]+)/)
        if (idParamMatch) id = idParamMatch[1]
      }
      
      if (id) {
        // Explicitly remove trailing /view or /edit if caught
        id = id.replace(/\/(view|edit|usp=sharing)$/, '')
        return `https://lh3.googleusercontent.com/d/${id}`
      }
    }
    return url
  }

  const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false
    return url.match(/\.(mp4|webm|ogg|mov)$|^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/i)
  }

  const getEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return url
    
    // YouTube
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/)?([^?&/]+)/i)
    if (ytMatch && !url.includes('/embed/') && !url.match(/\.(mp4|webm|ogg|mov)$/i)) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`
    }

    // Vimeo
    const vMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(\d+)/i)
    if (vMatch && !url.includes('/player.')) {
      return `https://player.vimeo.com/video/${vMatch[1]}`
    }

    return url
  }

  const updateTemp = (key, subKey, value) => {
    const processedValue = ['logo', 'image'].includes(subKey) ? getDirectImageUrl(value) : value
    setTempContent(prev => ({
      ...prev,
      [key]: { ...prev[key], [subKey]: processedValue }
    }))
  }

  const updatePricing = (index, field, value) => {
    const newPricing = [...tempContent.pricing]
    newPricing[index] = { ...newPricing[index], [field]: value }
    setTempContent({ ...tempContent, pricing: newPricing })
  }

  const updateBridal = (index, field, value) => {
    const newBridal = [...tempContent.bridal]
    newBridal[index] = { ...newBridal[index], [field]: value }
    setTempContent({ ...tempContent, bridal: newBridal })
  }

  const addGalleryItem = () => {
    const newGallery = [...tempContent.gallery, 'https://images.unsplash.com/photo-1522338228045-9b68e7ff4e0b?q=80&w=2080&auto=format&fit=crop']
    setTempContent({ ...tempContent, gallery: newGallery })
  }

  const deleteGalleryItem = (index) => {
    const newGallery = tempContent.gallery.filter((_, i) => i !== index)
    setTempContent({ ...tempContent, gallery: newGallery })
  }

  const updateGalleryItem = (index, value) => {
    const newGallery = [...tempContent.gallery]
    newGallery[index] = getDirectImageUrl(value)
    setTempContent({ ...tempContent, gallery: newGallery })
  }

  const updateSocials = (field, value) => {
    setTempContent(prev => ({
      ...prev,
      socials: { ...prev.socials, [field]: value }
    }))
  }

  const updateTestimonial = (index, field, value) => {
    const newTestimonials = [...tempContent.testimonials]
    newTestimonials[index] = { ...newTestimonials[index], [field]: value }
    setTempContent({ ...tempContent, testimonials: newTestimonials })
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    const { name, phone, service, query } = bookingForm
    const email = content.contact.email || 'makeoverbymonika05@gmail.com'

    setIsSending(true)
    setSubmitStatus(null)

    try {
      // Using FormSubmit.co AJAX endpoint with secure token
      const response = await fetch(`https://formsubmit.co/ajax/2347e07b00253a22062fe37362bb2ee6`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: name,
          Phone: phone,
          Service: service,
          Requirement_and_Budget: query,
          _subject: `New Booking Inquiry from ${name}`
        })
      })

      const result = await response.json()
      if (result.success) {
        setSubmitStatus({ type: 'success', message: 'Thank you! Your booking request has been sent successfully. I will contact you soon.' })
        setBookingForm({ name: '', phone: '', service: 'Select a service / package...', query: '' })
      } else {
        setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again or contact me via WhatsApp.' })
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please check your internet connection or try again later.' })
      console.error('Submission error:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setBookingForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectPackage = (serviceName) => {
    setBookingForm(prev => ({ ...prev, service: serviceName }))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    const { name, rating, message } = feedbackForm

    setIsSendingFeedback(true)
    setFeedbackStatus(null)

    try {
      const response = await fetch(`https://formsubmit.co/ajax/2347e07b00253a22062fe37362bb2ee6`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: name,
          Rating: rating + ' Stars',
          Message: message,
          _subject: `New Customer Feedback from ${name}`
        })
      })

      const result = await response.json()
      if (result.success) {
        setFeedbackStatus({ type: 'success', message: 'Thank you for your feedback! Your message has been sent directly to Monika.' })
        setFeedbackForm({ name: '', rating: 5, message: '' })
      } else {
        setFeedbackStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      setFeedbackStatus({ type: 'error', message: 'Failed to send message. Please check your internet connection.' })
    } finally {
      setIsSendingFeedback(false)
    }
  }

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target
    setFeedbackForm(prev => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050505', color: '#fff' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} style={{ marginBottom: '20px' }}>
          <Star size={40} color="var(--color-primary)" />
        </motion.div>
        <h2 style={{ letterSpacing: '2px', fontWeight: 600 }}>Loading Glamour...</h2>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Admin Floating Trigger */}
      {!isLoggedIn && (
        <button 
          onClick={() => setShowLogin(true)}
          style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: '#fff', padding: '10px', borderRadius: '50%', zIndex: 2000, cursor: 'pointer' }}
        >
          <LogIn size={20} />
        </button>
      )}

      {/* Admin Controls */}
      {isLoggedIn && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 2000 }}>
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.8)', padding: '5px', borderRadius: '30px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
            <button 
              onClick={() => setAdminTab('content')} 
              style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', background: adminTab === 'content' ? 'var(--color-primary)' : 'transparent', color: adminTab === 'content' ? '#000' : '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Edit Content
            </button>
            <button 
              onClick={() => setAdminTab('media')} 
              style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', background: adminTab === 'media' ? 'var(--color-primary)' : 'transparent', color: adminTab === 'media' ? '#000' : '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Media Manager
            </button>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Save size={18} /> Save
            </button>
            <button onClick={() => { setIsLoggedIn(false); setAdminTab('content') }} className="btn-primary" style={{ background: '#333', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={18} /> Exit
            </button>
          </div>
        </div>
      )}

      {/* Media Manager Overlay */}
      <AnimatePresence>
        {isLoggedIn && adminTab === 'media' && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(15px)', zIndex: 2500, padding: '30px', borderLeft: '1px solid var(--glass-border)', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Camera /> Media Manager</h2>
              <button onClick={() => setAdminTab('content')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div className="media-item">
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Main Logo</label>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1px solid var(--color-primary)', overflow: 'hidden', background: '#000', marginBottom: '10px' }}>
                  {isVideoUrl(tempContent.header.logo) ? (
                    <video src={tempContent.header.logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} muted />
                  ) : (
                    <img src={tempContent.header.logo} alt="Logo Prev" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
                <input 
                  type="text" 
                  value={tempContent.header.logo}
                  onChange={(e) => updateTemp('header', 'logo', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }}
                  placeholder="Logo URL"
                />
              </div>

              <div className="media-item">
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Hero Image</label>
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '10px', border: '1px solid #333' }}>
                  {isVideoUrl(tempContent.hero.image) ? (
                    <video src={tempContent.hero.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  ) : (
                    <img src={tempContent.hero.image} alt="Hero Prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <input 
                  type="text" 
                  value={tempContent.hero.image}
                  onChange={(e) => updateTemp('hero', 'image', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }}
                  placeholder="Hero Image URL"
                />
              </div>

              <div className="media-item">
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>About Image</label>
                <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '10px', border: '1px solid #333' }}>
                  {isVideoUrl(tempContent.about.image) ? (
                    <video src={tempContent.about.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  ) : (
                    <img src={tempContent.about.image} alt="About Prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <input 
                  type="text" 
                  value={tempContent.about.image}
                  onChange={(e) => updateTemp('about', 'image', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }}
                  placeholder="About Image URL"
                />
              </div>

              <div className="media-item">
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Luxury Hamper Image</label>
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '10px', border: '1px solid #333' }}>
                  {isVideoUrl(tempContent.hamper.image) ? (
                    <video src={tempContent.hamper.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  ) : (
                    <img src={tempContent.hamper.image} alt="Hamper Prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <input 
                  type="text" 
                  value={tempContent.hamper.image}
                  onChange={(e) => updateTemp('hamper', 'image', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }}
                  placeholder="Hamper Image URL"
                />
              </div>

              <div className="media-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Gallery Photos ({tempContent.gallery.length})</label>
                  <button onClick={addGalleryItem} style={{ background: 'var(--color-primary)', color: '#000', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>+ Add</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {tempContent.gallery.map((url, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <div style={{ width: '100%', aspectRatio: '1', borderRadius: '4px', overflow: 'hidden', border: '1px solid #333' }}>
                        {isVideoUrl(url) ? (
                          url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                            <video src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                          ) : (
                            <iframe src={getEmbedUrl(url)} style={{ width: '100%', height: '100%', border: 'none' }} title="Gallery Video" />
                          )
                        ) : (
                          <img src={url} alt="Gal Prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <button 
                        onClick={() => deleteGalleryItem(i)}
                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', border: 'none', color: '#fff', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <Trash2 size={12} />
                      </button>
                      <input 
                        type="text" 
                        value={url}
                        onChange={(e) => updateGalleryItem(i, e.target.value)}
                        style={{ width: '100%', marginTop: '5px', padding: '5px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '0.6rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links Manager */}
            <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Social Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>WhatsApp URL</label>
                  <input type="text" value={tempContent.socials.whatsapp} onChange={(e) => updateSocials('whatsapp', e.target.value)} style={{ width: '100%', padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Instagram URL</label>
                  <input type="text" value={tempContent.socials.instagram} onChange={(e) => updateSocials('instagram', e.target.value)} style={{ width: '100%', padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Gmail URL (mailto:)</label>
                  <input type="text" value={tempContent.socials.gmail} onChange={(e) => updateSocials('gmail', e.target.value)} style={{ width: '100%', padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '0.8rem' }} />
                </div>
              </div>
            </div>

            {/* Testimonials Manager */}
            <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Testimonials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {tempContent.testimonials.map((t, i) => (
                  <div key={i} style={{ padding: '15px', background: '#222', borderRadius: '8px', border: '1px solid #444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <input value={t.name} onChange={(e) => updateTestimonial(i, 'name', e.target.value)} placeholder="Name" style={{ background: 'none', border: 'none', borderBottom: '1px solid #555', color: '#fff', fontSize: '0.9rem', width: '70%' }} />
                       <input type="number" min="1" max="5" value={t.rating} onChange={(e) => updateTestimonial(i, 'rating', parseInt(e.target.value))} style={{ width: '40px', background: 'none', border: 'none', color: 'var(--color-primary)' }} />
                    </div>
                    <textarea value={t.comment} onChange={(e) => updateTestimonial(i, 'comment', e.target.value)} placeholder="Feedback" style={{ width: '100%', background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.8rem', minHeight: '60px' }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '20px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', border: '1px solid var(--color-primary)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                <strong>Tip:</strong> You can use Google Drive links! They will be automatically converted to direct display links.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(5px)' }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card" style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Admin Login</h3>
                <button onClick={() => setShowLogin(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X /></button>
              </div>
              <form onSubmit={handleLogin}>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
                />
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="header" style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '15px 5%'
      }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid var(--color-primary)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000'
            }}>
              <img 
                src={isLoggedIn ? tempContent.header.logo : content.header.logo} 
                alt="Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            {isLoggedIn && (
               <input 
                 type="text" 
                 value={tempContent.header.logo}
                 onChange={(e) => updateTemp('header', 'logo', e.target.value)}
                 placeholder="Logo URL"
                 style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px dashed var(--color-primary)', padding: '5px', borderRadius: '4px', fontSize: '0.7rem', width: '140px' }}
               />
            )}
            <span style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '2px' }}>GLAM WITH MONIKA</span>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '30px' }}>
            <a href="#about" style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>About</a>
            <a href="#services" style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Services</a>
            <a href="#pricing" style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Packages</a>
            <a href="#gallery" style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Gallery</a>
            <a href="#contact" style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Contact</a>
          </div>
        </nav>
      </header>

      <main style={{ marginTop: '80px' }}>
        {/* Hero Section */}
        <section id="hero" style={{ height: '90vh', display: 'flex', alignItems: 'center', padding: '0 5%', position: 'relative', overflow: 'hidden' }}>
          <div style={{ flex: 1, zIndex: 1, maxWidth: '600px' }}>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="script-text"
              style={{ marginBottom: '10px' }}
            >Hi, I'm Monika ✨</motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '4rem', marginBottom: '20px', lineHeight: 1.1 }}
            >
              {isLoggedIn ? (
                <input 
                  value={tempContent.hero.tagline}
                  onChange={(e) => updateTemp('hero', 'tagline', e.target.value)}
                  style={{ background: 'none', border: '1px dashed var(--color-primary)', color: 'inherit', width: '100%', fontSize: 'inherit', fontFamily: 'inherit' }}
                />
              ) : (
                <><span style={{ color: 'var(--color-primary)' }}>{content.hero.tagline}</span></>
              )}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '30px' }}
            >
              {isLoggedIn ? (
                <textarea 
                  value={tempContent.hero.description}
                  onChange={(e) => updateTemp('hero', 'description', e.target.value)}
                  style={{ background: 'none', border: '1px dashed var(--color-primary)', color: 'inherit', width: '100%', fontSize: 'inherit', fontFamily: 'inherit', minHeight: '100px' }}
                />
              ) : content.hero.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
            >
              <a href="#pricing" className="btn-primary">Book Now</a>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Starting from</span>
                {isLoggedIn ? (
                  <input 
                    value={tempContent.hero.price}
                    onChange={(e) => updateTemp('hero', 'price', e.target.value)}
                    style={{ background: 'none', border: '1px dashed var(--color-primary)', color: 'var(--color-secondary)', width: '120px', fontSize: 'inherit', fontWeight: 'bold' }}
                  />
                ) : (
                  <span className="price-tag">{content.hero.price}</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <a 
                  href={isLoggedIn ? tempContent.hero.pdfUrl : content.hero.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ background: 'none', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  View Rate Card (PDF)
                </a>
                {isLoggedIn && (
                  <input 
                    type="text" 
                    value={tempContent.hero.pdfUrl}
                    onChange={(e) => updateTemp('hero', 'pdfUrl', e.target.value)}
                    placeholder="PDF URL"
                    style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px dashed var(--color-primary)', padding: '5px', borderRadius: '4px', fontSize: '0.7rem' }}
                  />
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Hero Image Container */}
          <div style={{ position: 'absolute', right: 0, top: 0, width: '55%', height: '100%', overflow: 'hidden' }}>
            {isLoggedIn && (
              <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
                <input 
                  type="text" 
                  value={tempContent.hero.image}
                  onChange={(e) => updateTemp('hero', 'image', e.target.value)}
                  placeholder="Paste Image URL"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid var(--color-primary)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}
                />
              </div>
            )}
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundImage: `url("${isLoggedIn ? tempContent.hero.image : content.hero.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              maskImage: 'linear-gradient(to left, black 70%, transparent)',
              WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent)'
            }}></div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{ display: 'flex', gap: '60px', alignItems: 'center', padding: '100px 5%' }}>
          <div style={{ flex: 1 }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-card">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                {isLoggedIn ? (
                  <input 
                    value={tempContent.about.title}
                    onChange={(e) => updateTemp('about', 'title', e.target.value)}
                    style={{ background: 'none', border: '1px dashed var(--color-primary)', color: 'inherit', width: '100%', fontSize: 'inherit', fontFamily: 'inherit' }}
                  />
                ) : content.about.title}
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                {isLoggedIn ? (
                  <textarea 
                    value={tempContent.about.p1}
                    onChange={(e) => updateTemp('about', 'p1', e.target.value)}
                    style={{ background: 'none', border: '1px dashed var(--color-primary)', color: 'inherit', width: '100%', fontSize: 'inherit', fontFamily: 'inherit', minHeight: '80px' }}
                  />
                ) : content.about.p1}
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                {isLoggedIn ? (
                  <textarea 
                    value={tempContent.about.p2}
                    onChange={(e) => updateTemp('about', 'p2', e.target.value)}
                    style={{ background: 'none', border: '1px dashed var(--color-primary)', color: 'inherit', width: '100%', fontSize: 'inherit', fontFamily: 'inherit', minHeight: '80px' }}
                  />
                ) : content.about.p2}
              </p>
              <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
                <div>
                  <h4 style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>5+</h4>
                  <p style={{ fontSize: '0.9rem' }}>Years Experience</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>2000+</h4>
                  <p style={{ fontSize: '0.9rem' }}>Happy Clients</p>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '5px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="var(--color-primary)" color="var(--color-primary)" />)}
                  </div>
                  <p style={{ fontSize: '0.9rem' }}>Customer Rating</p>
                </div>
              </div>

              {/* Customer Feedback & Rating */}
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Star fill="var(--color-primary)" color="var(--color-primary)" /> Customer Feedback
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {(isLoggedIn ? tempContent.testimonials : content.testimonials).map((rev, i) => (
                    <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                         {[...Array(rev.rating)].map((_, j) => <Star key={j} size={14} fill="var(--color-primary)" color="var(--color-primary)" />)}
                       </div>
                       <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '8px' }}>"{rev.comment}"</p>
                       <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>— {rev.name}</p>
                    </div>
                  ))}
                </div>

                {/* Optional User Feedback Submission Form */}
                <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Share Your Experience</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '15px' }}>Your review will be sent directly to Monika.</p>
                  <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                      type="text"
                      name="name"
                      value={feedbackForm.name}
                      onChange={handleFeedbackChange}
                      required
                      placeholder="Your Name"
                      style={{ padding: '10px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Rating:</label>
                      <select
                        name="rating"
                        value={feedbackForm.rating}
                        onChange={handleFeedbackChange}
                        style={{ padding: '8px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                        <option value="2">⭐⭐ (2 Stars)</option>
                        <option value="1">⭐ (1 Star)</option>
                      </select>
                    </div>
                    <textarea
                      name="message"
                      value={feedbackForm.message}
                      onChange={handleFeedbackChange}
                      required
                      placeholder="Write your review here..."
                      rows="3"
                      style={{ padding: '10px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
                    />
                    <button 
                      type="submit" 
                      disabled={isSendingFeedback}
                      className="btn-primary" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSendingFeedback ? 0.7 : 1, cursor: isSendingFeedback ? 'not-allowed' : 'pointer' }}
                    >
                      {isSendingFeedback ? 'Sending...' : 'Send Review'}
                    </button>
                    {feedbackStatus && (
                      <p style={{ fontSize: '0.85rem', color: feedbackStatus.type === 'success' ? '#4caf50' : '#f44336', textAlign: 'center' }}>
                        {feedbackStatus.message}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
             {isLoggedIn && (
               <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                 <input 
                   type="text" 
                   value={tempContent.about.image}
                   onChange={(e) => updateTemp('about', 'image', e.target.value)}
                   placeholder="Image URL"
                   style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid var(--color-primary)', padding: '5px', fontSize: '0.7rem' }}
                 />
               </div>
             )}
             <div style={{ 
               width: '100%', 
               aspectRatio: '4/5', 
               borderRadius: '20px', 
               overflow: 'hidden',
               border: '1px solid var(--glass-border)'
             }}>
               <img src={isLoggedIn ? tempContent.about.image : content.about.image} alt="Monika working" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
          </div>
        </section>

        {/* Services & Makeup Types */}
        <section id="services" style={{ padding: '100px 5%' }}>
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '60px' }}>Types of <span style={{ color: 'var(--color-primary)' }}>Makeup</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[
              { title: 'Soft Glam', desc: 'Elegant, luminous finish for a timeless look.', icon: <Star /> },
              { title: 'HD Glow', desc: 'Skin-like high definition base with a fresh radiant finish.', icon: <Sparkles /> },
              { title: 'Airbrush Luxury', desc: 'Flawless, waterproof, and long-lasting luxury finish.', icon: <Star /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="glass-card" 
                style={{ textAlign: 'center' }}
              >
                <div style={{ color: 'var(--color-primary)', marginBottom: '20px', display: 'inline-block' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>{item.title}</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Packages */}
        <section id="pricing" style={{ background: '#0f0f0f', padding: '100px 5%', borderRadius: '40px 40px 0 0' }}>
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>Bridal & Event <span style={{ color: 'var(--color-primary)' }}>Packages</span></h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '60px' }}>Curated beauty experiences for your special days</p>
          
          <h3 style={{ fontSize: '2rem', marginBottom: '30px', borderBottom: '2px solid var(--color-primary)', display: 'inline-block' }}>Pre-Wedding Glam</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '80px' }}>
            {(isLoggedIn ? tempContent.pricing : content.pricing).map((pkg, i) => (
              <motion.div key={i} className="glass-card" whileHover={{ scale: 1.02 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3>
                    {isLoggedIn ? (
                      <input 
                        value={pkg.name} 
                        onChange={(e) => updatePricing(i, 'name', e.target.value)}
                        style={{ background: 'none', border: '1px dashed #555', color: 'inherit', fontSize: 'inherit' }}
                      />
                    ) : pkg.name}
                  </h3>
                  {isLoggedIn ? (
                    <input 
                      value={pkg.price} 
                      onChange={(e) => updatePricing(i, 'price', e.target.value)}
                      style={{ background: 'none', border: '1px dashed #555', color: 'var(--color-primary)', width: '80px' }}
                    />
                  ) : <span className="price-tag">{pkg.price}</span>}
                </div>
                <ul style={{ listStyle: 'none', color: 'var(--color-text-muted)', marginBottom: '30px' }}>
                  {pkg.details.map((d, id) => <li key={id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><Star size={16} color="var(--color-primary)" /> {d}</li>)}
                </ul>
                <button onClick={() => handleSelectPackage(pkg.name)} className="btn-primary" style={{ width: '100%' }}>Book This Package</button>
              </motion.div>
            ))}
          </div>

          <h3 style={{ fontSize: '2rem', marginBottom: '30px', borderBottom: '2px solid var(--color-primary)', display: 'inline-block' }}>Bridal / Pheras</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {(isLoggedIn ? tempContent.bridal : content.bridal).map((pkg, i) => (
              <motion.div key={i} className="glass-card" whileHover={{ scale: 1.02 }} style={{ border: i === 1 ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)', position: 'relative' }}>
                {i === 1 && <span style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: '#000', padding: '2px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>MOST POPULAR</span>}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: i === 1 ? '10px' : 0 }}>
                  <h3>
                    {isLoggedIn ? (
                      <input 
                        value={pkg.name} 
                        onChange={(e) => updateBridal(i, 'name', e.target.value)}
                        style={{ background: 'none', border: '1px dashed #555', color: 'inherit', fontSize: 'inherit' }}
                      />
                    ) : pkg.name}
                  </h3>
                  {isLoggedIn ? (
                    <input 
                      value={pkg.price} 
                      onChange={(e) => updateBridal(i, 'price', e.target.value)}
                      style={{ background: 'none', border: '1px dashed #555', color: 'var(--color-primary)', width: '80px' }}
                    />
                  ) : <span className="price-tag">{pkg.price}</span>}
                </div>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Includes: Premium Brand Products, Lenses, Lashes, Hairstyle, Draping & Luxury Hamper.</p>
                <button onClick={() => handleSelectPackage(pkg.name)} className="btn-primary" style={{ width: '100%' }}>Select Plan</button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bridal Hamper Section */}
        <section id="hamper" style={{ padding: '100px 5%' }}>
          <div className="glass-card" style={{ display: 'flex', gap: '50px', alignItems: 'center', background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)' }}>
            <div style={{ flex: 1 }}>
              <span className="script-text">Special Gift</span>
              <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Luxury <span style={{ color: 'var(--color-primary)' }}>Bridal Hamper</span></h2>
              <p style={{ marginBottom: '30px', color: 'var(--color-text-muted)' }}>A little something to make your bridal glow even more special ❤️</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ marginBottom: '10px' }}>Beauty Essentials</h4>
                  <ul style={{ listStyle: 'none', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    <li>• Hydrating lip oil</li>
                    <li>• Pocket perfume roller</li>
                    <li>• Under-eye cooling patches</li>
                    <li>• Clear brow / lash gel mini</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ marginBottom: '10px' }}>Skin & Comfort</h4>
                  <ul style={{ listStyle: 'none', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    <li>• Blotting paper & Powder puff</li>
                    <li>• Silk scrunchie & hair pin</li>
                    <li>• Luxury chocolate</li>
                    <li>• Personalized note</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              {isLoggedIn && (
                 <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                   <input 
                     type="text" 
                     value={tempContent.hamper.image}
                     onChange={(e) => updateTemp('hamper', 'image', e.target.value)}
                     placeholder="Hamper Image URL"
                     style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid var(--color-primary)', padding: '5px', fontSize: '0.7rem' }}
                   />
                 </div>
              )}
              <img src={isLoggedIn ? tempContent.hamper.image : content.hamper.image} alt="Hamper" style={{ width: '100%', borderRadius: '12px' }} />
            </div>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section id="gallery" style={{ padding: '100px 5%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem' }}>Portfolio <span style={{ color: 'var(--color-primary)' }}>Gallery</span></h2>
            {isLoggedIn && (
              <button 
                onClick={addGalleryItem}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--color-primary)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '40px', cursor: 'pointer', fontWeight: 600 }}
              >
                <Plus size={18} /> Add New Photo
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gridAutoRows: '300px', gap: '20px' }}>
            {(isLoggedIn ? tempContent.gallery : content.gallery).map((url, n) => (
              <motion.div 
                key={n} 
                whileHover={{ scale: 1.02 }}
                style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  gridRow: n % 3 === 0 ? 'span 2' : 'span 1',
                  background: '#1a1a1a',
                  position: 'relative'
                }}
              >
                {isVideoUrl(url) ? (
                  url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop />
                  ) : (
                    <iframe src={getEmbedUrl(url)} style={{ width: '100%', height: '100%', border: 'none' }} title="Portfolio Video" allowFullScreen />
                  )
                ) : (
                  <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                {isLoggedIn && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', padding: '10px', gap: '10px', opacity: 0, transition: 'opacity 0.2s' }} className="admin-overlay">
                    <input 
                      type="text" 
                      value={url}
                      onChange={(e) => updateGalleryItem(n, e.target.value)}
                      placeholder="Image URL"
                      style={{ background: '#000', color: '#fff', border: '1px solid var(--color-primary)', padding: '5px', borderRadius: '4px', fontSize: '0.7rem' }}
                    />
                    <button 
                      onClick={() => deleteGalleryItem(n)}
                      style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
                {isLoggedIn && (
                  <style>{`
                    div[style*="relative"]:hover .admin-overlay { opacity: 1 !important; }
                  `}</style>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact / Booking Form */}
        <section id="contact" style={{ padding: '100px 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Book Your <span style={{ color: 'var(--color-primary)' }}>Session</span></h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '50px' }}>Get dolled up on your special day! Fill out the form below or contact me directly.</p>
            
            <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a href={content.socials.whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                  <Phone />
                </a>
                {isLoggedIn ? (
                  <input value={tempContent.contact.phone} onChange={(e) => updateTemp('contact', 'phone', e.target.value)} style={{ background: 'none', border: '1px dashed var(--color-primary)', color: '#fff' }} />
                ) : <span>{content.contact.phone}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin color="var(--color-primary)" />
                {isLoggedIn ? (
                   <input value={tempContent.contact.location} onChange={(e) => updateTemp('contact', 'location', e.target.value)} style={{ background: 'none', border: '1px dashed var(--color-primary)', color: '#fff' }} />
                ) : <span>{content.contact.location}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a href={content.socials.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                  <Instagram />
                </a>
                {isLoggedIn ? (
                   <input value={tempContent.contact.instagram} onChange={(e) => updateTemp('contact', 'instagram', e.target.value)} style={{ background: 'none', border: '1px dashed var(--color-primary)', color: '#fff' }} />
                ) : <span>{content.contact.instagram}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a href={content.socials.gmail} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                  <Edit2 size={18} />
                </a>
                {isLoggedIn ? (
                   <input value={tempContent.contact.email} onChange={(e) => updateTemp('contact', 'email', e.target.value)} style={{ background: 'none', border: '1px dashed var(--color-primary)', color: '#fff' }} />
                ) : <a href={content.socials.gmail} style={{ color: 'inherit', textDecoration: 'none' }}>{content.contact.email}</a>}
              </div>
            </div>

            {/* Social Direct Links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
              <a href={content.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: '#25D366', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={18} /> WhatsApp Me
              </a>
              <a href={content.socials.instagram} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Instagram size={18} /> Instagram
              </a>
              <a href={content.socials.gmail} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: '#DB4437', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={18} /> Gmail
              </a>
            </div>

            <form onSubmit={handleBookingSubmit} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={bookingForm.name}
                  onChange={handleFormChange}
                  required
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }} 
                  placeholder="Your Name" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleFormChange}
                  required
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }} 
                  placeholder="Your Phone Number" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                <label>Select a service / package</label>
                <select 
                  name="service"
                  value={bookingForm.service}
                  onChange={handleFormChange}
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                >
                  <option>Select a service / package...</option>
                  <option>Bride/package</option>
                  <option>Pre-bridal events</option>
                  <option>Sider / party makeup</option>
                  <option>All of the above</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                <label>Specify your requirement & budget</label>
                <textarea 
                  name="query"
                  value={bookingForm.query}
                  onChange={handleFormChange}
                  required
                  rows="4" 
                  style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }} 
                  placeholder="Tell me about your special day, requested look, and budget..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSending}
                style={{ gridColumn: 'span 2', fontSize: '1.2rem', padding: '15px', opacity: isSending ? 0.7 : 1, cursor: isSending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                {isSending ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ border: '2px solid #000', borderTop: '2px solid transparent', borderRadius: '50%', width: '20px', height: '20px' }} />
                    Sending...
                  </>
                ) : 'Send Booking Request'}
              </button>
              {submitStatus && (
                <div style={{ 
                  gridColumn: 'span 2', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  fontSize: '1rem',
                  background: submitStatus.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                  color: submitStatus.type === 'success' ? '#4caf50' : '#f44336',
                  border: submitStatus.type === 'success' ? '1px solid #4caf50' : '1px solid #f44336',
                  textAlign: 'center'
                }}>
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer style={{ padding: '60px 5%', borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: '#050505' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                border: '1px solid var(--color-primary)', 
                overflow: 'hidden',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <img src={content.header.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontWeight: 600 }}>GLAM WITH MONIKA</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>© 2004. All rights reserved. Available for Destination Bookings.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
               <a href={content.socials.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}><Instagram size={20} /></a>
               <a href={content.socials.whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}><Phone size={20} /></a>
            </div>
          </div>
      </footer>
    </div>
  )
}

export default App
