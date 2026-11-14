import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Code2, ShoppingBag, PanelsTopLeft, Database, Gauge, PenTool, Layers3, ShieldCheck, MessageCircle, Globe2, Sparkles, Check, ChevronDown, Mail, Phone, Instagram, Send, HeartHandshake, Compass, Workflow, Rocket } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';

const nav = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Services', 'services'],
  ['Our Projects', 'projects'],
  ['Pricing', 'pricing'],
  ['Contact Us', 'contact']
];

const services = [
  { icon: PanelsTopLeft, n: '01', title: 'Custom website development', desc: 'A considered online home for your business, brand, or next big idea.', tags: ['Business sites', 'Landing pages', 'Portfolios'] },
  { icon: Layers3, n: '02', title: 'Full-stack development', desc: 'Thoughtful frontends backed by dependable APIs, data, and custom workflows.', tags: ['Web apps', 'Authentication', 'Database'] },
  { icon: ShoppingBag, n: '03', title: 'E-commerce experiences', desc: 'Product-led storefronts designed to make browsing and buying feel effortless.', tags: ['Product catalogs', 'Cart flows', 'Order tools'] },
  { icon: PenTool, n: '04', title: 'UI/UX design', desc: 'Clear, intuitive interfaces that make the right next step feel obvious.', tags: ['Responsive UI', 'Redesigns', 'Prototyping'] },
  { icon: Database, n: '05', title: 'APIs & integrations', desc: 'Connect your product to the services and systems your business relies on.', tags: ['REST APIs', 'Integrations', 'Backend'] },
  { icon: Gauge, n: '06', title: 'Care & optimization', desc: 'Keep your website current, quick, and working smoothly as you grow.', tags: ['Maintenance', 'Performance', 'Support'] }
];

const projects = [
  { title: 'Table & Thyme', type: 'Restaurant concept', desc: 'A warm, editorial dining experience with a menu built to make you linger.', tags: ['React', 'Responsive UI'], theme: 'food', icon: '✳' },
  { title: 'Northline Athletics', type: 'Fitness concept', desc: 'A confident digital home for a neighborhood studio and its community.', tags: ['React', 'Motion'], theme: 'fit', icon: 'N' },
  { title: 'Forma Objects', type: 'E-commerce concept', desc: 'A minimal product storefront that gives considered objects room to breathe.', tags: ['React', 'Commerce UI'], theme: 'shop', icon: 'F' },
  { title: 'Studio Rove', type: 'Portfolio concept', desc: 'An expressive portfolio concept for an independent creative practice.', tags: ['React', 'Art direction'], theme: 'folio', icon: 'R' },
  { title: 'Fieldnotes Academy', type: 'Education concept', desc: 'A welcoming learning hub concept that makes discovery feel simple.', tags: ['React', 'Dashboard'], theme: 'learn', icon: 'f.' },
  { title: 'Orbit Workspace', type: 'Web app concept', desc: 'A clean productivity dashboard concept built around calmer workflows.', tags: ['React', 'App UI'], theme: 'app', icon: '◌' }
];

const faqs = [
  ['What services does WebStack Studio provide?', 'We design and develop custom websites, full-stack web applications, e-commerce experiences, APIs, and ongoing website improvements.'],
  ['How can I get a website developed?', 'Tell us a little about your goals using the quote form. We’ll get in touch to understand the scope and suggest a practical next step.'],
  ['How much does website development cost?', 'Every project is different. Final pricing depends on complexity, features, integrations, and requirements. Request a quote for a tailored estimate.'],
  ['How long does it take to build a website?', 'Timelines depend on the scope, content, and feedback cadence. We’ll outline a project roadmap after learning about your requirements.'],
  ['Can you redesign an existing website?', 'Yes. We can refresh the look and feel, improve the user experience, or rebuild the site around your current business goals.'],
  ['Do you provide e-commerce websites?', 'Yes. We can build online stores with product catalogs, cart flows, and integrations suited to your requirements.'],
  ['Can I request custom website functionality?', 'Absolutely. Share the workflow or feature you have in mind and we’ll discuss the right approach.'],
  ['Do you provide maintenance and support?', 'Ongoing maintenance, bug fixes, and optimization can be discussed as part of your project.'],
  ['Can I work with you from outside India?', 'Yes. WebStack Studio works online with clients worldwide.'],
  ['How can I contact WebStack Studio?', 'Use the quote form, email wildcyrus107@gmail.com, call +91 9898221976, or reach us on Instagram @webstack.studio.']
];

function Logo() {
  return (
    <a href="#home" className="brand" aria-label="WebStack Studio — Back to top">
      <span className="brand-mark" aria-hidden="true"><span>W</span><i>S</i></span>
      <span className="brand-name">webstack<span>studio</span></span>
    </a>
  );
}

function Button({ children, href = '#contact', secondary = false, ...props }) {
  return (
    <a className={`button ${secondary ? 'button-quiet' : ''}`} href={href} {...props}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="header" role="banner">
      <div className="nav-wrap">
        <Logo />
        {open && <div className="nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
        <nav
          id="primary-navigation"
          aria-label="Main Navigation"
          className={open ? 'nav nav-open' : 'nav'}
        >
          {nav.map(([name, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {name}
            </a>
          ))}
          <a className="nav-quote" href="#contact" onClick={() => setOpen(false)}>
            Get a quote <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="primary-navigation"
          className="menu-toggle"
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-shell" id="home" aria-labelledby="hero-title">
      <div className="hero-glow glow-one" aria-hidden="true" />
      <div className="hero-glow glow-two" aria-hidden="true" />
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="pulse-dot" aria-hidden="true" /> YOUR ONLINE FULL-STACK DEVELOPMENT PARTNER
        </div>
        <h1 id="hero-title">
          We build.<br /><span>You grow.</span>
        </h1>
        <p className="hero-sub">
          Your vision deserves a <em>powerful</em><br className="desktop-break" /> digital presence.
        </p>
        <p className="hero-desc">
          From standout business websites to thoughtful full-stack applications, we turn ideas into digital experiences built for what’s next.
        </p>
        <div className="hero-actions">
          <Button href="#services">Explore our services</Button>
          <Button href="#contact" secondary>Get a free quote</Button>
        </div>
        <div className="hero-foot">
          <span><Globe2 size={15} aria-hidden="true" /> Working worldwide, online</span>
          <span><span className="mini-line" aria-hidden="true" /> Independent digital studio</span>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />
        <div className="float-chip chip-react"><span className="react-symbol">⚛</span> React</div>
        <div className="float-chip chip-code"><Code2 size={17} /> Thoughtful code</div>
        <div className="float-chip chip-live"><span className="pulse-dot" /> Built to grow</div>
        <div className="browser">
          <div className="browser-bar">
            <div className="traffic"><i /><i /><i /></div>
            <div className="address">webstack.studio</div>
            <div className="browser-menu">•••</div>
          </div>
          <div className="mock-page">
            <div className="mock-nav">
              <span className="mock-brand"><b>W</b> studio</span>
              <span>Work&nbsp;&nbsp;&nbsp; About&nbsp;&nbsp;&nbsp; Contact</span>
              <span className="mock-cta">Let’s talk ↗</span>
            </div>
            <div className="mock-content">
              <div className="mock-label"><span /> DIGITAL STUDIO · EST. FOR WHAT’S NEXT</div>
              <div className="mock-title">Ideas, meet<br /><span>the internet.</span></div>
              <div className="mock-description" />
              <div className="mock-description short" />
              <div className="mock-action">Explore the studio <ArrowRight size={13} /></div>
            </div>
            <div className="mock-orb">
              <div className="orb-core">W<span>S</span></div>
            </div>
            <div className="mock-bottom">
              <span>Design with intent</span>
              <span>SCROLL TO EXPLORE ↓</span>
            </div>
          </div>
        </div>
        <div className="art-caption"><span className="caption-line" /> Carefully considered. Built with care.</div>
      </div>
      <a className="scroll-cue" href="#about" aria-label="Scroll down to About section">
        <ArrowDown size={15} aria-hidden="true" /> SCROLL TO EXPLORE
      </a>
      <div className="hero-index" aria-hidden="true">01 <span /> 06</div>
    </section>
  );
}

function SectionHeading({ kicker, title, children, light = false }) {
  return (
    <div className={`section-heading ${light ? 'heading-light' : ''}`}>
      <div className="eyebrow"><span className="heading-dash" aria-hidden="true" />{kicker}</div>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function About() {
  return (
    <section className="about section-shell" id="about" aria-labelledby="about-title">
      <div className="about-visual" aria-hidden="true">
        <div className="about-frame">
          <div className="frame-top">
            <span>THE STUDIO, IN A NUTSHELL</span>
            <span>EST. FOR WHAT’S NEXT</span>
          </div>
          <div className="frame-graphic">
            <div className="frame-circle circle-back" />
            <div className="frame-circle circle-front"><span>WS</span></div>
            <div className="frame-cross">+</div>
            <div className="frame-rings" />
          </div>
          <div className="frame-bottom">
            <span>Curiosity in. <b>Possibility out.</b></span>
            <span>INDEPENDENT BY DESIGN</span>
          </div>
        </div>
        <div className="floating-note">
          <Sparkles size={16} />
          <span>Small studio.<br /><b>Big-picture thinking.</b></span>
        </div>
      </div>
      <div className="about-copy">
        <SectionHeading kicker="A LITTLE ABOUT US" title={<>Small team energy.<br /><span className="outline-text">Big-picture thinking.</span></>}>
          Good digital work starts with listening. We bring design and engineering together to make websites and products that feel right for your business.
        </SectionHeading>
        <p className="body-copy">
          WebStack Studio is an online web development company focused on building modern, scalable, and user-friendly digital solutions. We help businesses, startups, and individuals turn ideas into professional digital products—with thoughtful design and reliable development from first sketch to launch.
        </p>
        <div className="values">
          <div>
            <span className="value-icon"><Sparkles size={18} aria-hidden="true" /></span>
            <b>Innovation</b>
            <small>Fresh thinking, practical ideas.</small>
          </div>
          <div>
            <span className="value-icon"><ShieldCheck size={18} aria-hidden="true" /></span>
            <b>Quality, always</b>
            <small>Details matter. We treat them that way.</small>
          </div>
          <div>
            <span className="value-icon"><HeartHandshake size={18} aria-hidden="true" /></span>
            <b>People first</b>
            <small>Your goals shape the work.</small>
          </div>
        </div>
        <a className="text-link" href="#contact">
          Let’s work together <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services section-shell" id="services" aria-labelledby="services-title">
      <div className="services-top">
        <SectionHeading kicker="WHAT WE DO" title={<>Digital solutions,<br /><span className="outline-text">thoughtfully built.</span></>}>
          One trusted partner for the design, development, and details behind your next digital step.
        </SectionHeading>
        <span className="section-index" aria-hidden="true">01 — 06<br /><small>CAPABILITIES</small></span>
      </div>
      <div className="service-grid">
        {services.map((s, i) => (
          <motion.article
            className="service-card"
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="service-meta">
              <span>{s.n} / CAPABILITY</span>
              <s.icon size={21} aria-hidden="true" />
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="service-tags">
              {s.tags.map(t => <span key={t}>{t}</span>)}
            </div>
            <a href="#contact" aria-label={`Enquire about ${s.title}`} className="card-arrow">
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </motion.article>
        ))}
      </div>
      <div className="service-note">
        <span className="note-star" aria-hidden="true">✳</span>
        Have something more specific in mind? <a href="#contact">Tell us about it <ArrowRight size={14} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function Stack() {
  const groups = [
    ['01 / FRONTEND', 'HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind'],
    ['02 / BACKEND', 'Node.js', 'Express.js', 'Python', 'Java'],
    ['03 / DATA', 'MongoDB', 'MySQL', 'PostgreSQL'],
    ['04 / TOOLS', 'Git', 'GitHub', 'VS Code', 'Figma']
  ];
  return (
    <section className="stack section-shell" aria-labelledby="stack-title">
      <div className="stack-intro">
        <div className="eyebrow"><span className="heading-dash" aria-hidden="true" />TOOLS OF THE TRADE</div>
        <h2 id="stack-title">The right tools.<br /><span className="outline-text">For your kind of project.</span></h2>
        <p>We choose a reliable, modern stack around what you’re building—not the other way around.</p>
      </div>
      <div className="stack-groups">
        {groups.map(([label, ...items], i) => (
          <div className="stack-group" key={label}>
            <div className="stack-label">{label}</div>
            <div className="stack-items">
              {items.map((item, j) => (
                <div className="stack-item" key={item}>
                  <span className={`tech-glyph tech-${(i + j) % 5}`} aria-hidden="true">
                    {['◈', '⌘', '◉', '⟡', '⌬'][((i + j) * 3) % 5]}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="projects section-shell" id="projects" aria-labelledby="projects-title">
      <div className="project-heading-row">
        <SectionHeading kicker="A FEW IDEAS, IN MOTION" title={<>Concepts with<br /><span className="outline-text">room to grow.</span></>}>
          A glimpse at the kinds of digital experiences we love to create.
        </SectionHeading>
        <span className="project-disclaimer">
          <span className="pulse-dot" aria-hidden="true" /> CONCEPT PROJECTS<br />
          <small>Explorations, not client work</small>
        </span>
      </div>
      <div className="project-grid">
        {projects.map((p, i) => (
          <motion.article
            className="project-card"
            key={p.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className={`project-art art-${p.theme}`} aria-hidden="true">
              <div className="project-browser">
                <span /><span /><span />
                <i>{p.title.toLowerCase().replaceAll(' ', '')}</i>
                <ArrowUpRight size={13} />
              </div>
              <div className="project-preview">
                <div className="project-decoration">{p.icon}</div>
                <div className="preview-kicker">A DIGITAL CONCEPT</div>
                <div className="preview-title">{p.title}</div>
                <div className="preview-line" />
                <div className="preview-line small" />
                <div className="preview-button">EXPLORE <ArrowRight size={11} /></div>
              </div>
              <div className="concept-stamp">CONCEPT<br />PROJECT</div>
            </div>
            <div className="project-info">
              <div>
                <span className="project-type">{p.type}</span>
                <h3>{p.title}</h3>
              </div>
              <span className="project-count" aria-hidden="true">0{i + 1}</span>
            </div>
            <p>{p.desc}</p>
            <div className="project-foot">
              <div className="project-tags">
                {p.tags.map(t => <span key={t}>{t}</span>)}
              </div>
              <span className="demo-pill">DEMO CONCEPT</span>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="projects-bottom">
        <span>Want to see what we could build for you?</span>
        <a href="#contact">Let’s start a conversation <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function Why() {
  const points = [
    ['Responsive by nature', 'Designed to feel at home on every screen, tablet, and mobile device.'],
    ['Built around you', 'Your goals, requirements, and customers always come first.'],
    ['Room to scale', 'A considered foundation built for wherever your business expands next.'],
    ['Clear collaboration', 'Straightforward communication from initial kickoff to launch day.'],
    ['Design that works', 'Useful, user-friendly interfaces with a distinct point of view.'],
    ['Support beyond launch', 'Dependable care, optimization, and assistance as you grow.']
  ];
  return (
    <section className="why section-shell" aria-labelledby="why-title">
      <div className="why-copy">
        <SectionHeading kicker="WHY WEBSTACK" title={<>Good work.<br /><span className="outline-text">Good people.</span></>}>
          You bring the ambition. We bring thoughtful design, dependable development, and a genuine interest in getting it right.
        </SectionHeading>
        <div className="why-annotation">
          <span aria-hidden="true">↗</span>
          <small>MADE FOR THE WAY<br />YOU WANT TO GROW</small>
        </div>
      </div>
      <div className="why-grid">
        {points.map(([title, desc], i) => (
          <div className="why-item" key={title}>
            <span className="why-number" aria-hidden="true">0{i + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
            <ArrowUpRight size={15} aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ['01', 'Listen', 'We get to know your business, goals, audience, and must-haves.'],
    ['02', 'Plan', 'We map the structure, features, and a clear project roadmap.'],
    ['03', 'Design', 'We shape an intuitive visual direction for your audience.'],
    ['04', 'Build', 'We bring the design to life across frontend, backend, and data.'],
    ['05', 'Refine', 'We review responsiveness, usability, and the details together.'],
    ['06', 'Launch', 'We deploy your website and agree the handover and next steps.']
  ];
  return (
    <section className="process section-shell" aria-labelledby="process-title">
      <div className="process-top">
        <SectionHeading kicker="HOW WE WORK" title={<>From first hello<br /><span className="outline-text">to launch day.</span></>}>
          A clear, collaborative process—with space to ask questions and make considered decisions.
        </SectionHeading>
        <div className="process-mark" aria-hidden="true">
          <Workflow size={33} />
          <span>GOOD THINGS<br />TAKE SHAPE</span>
        </div>
      </div>
      <div className="process-steps">
        {steps.map(([n, title, desc], i) => (
          <div className="process-step" key={n}>
            <div className="step-head">
              <span>{n}</span>
              <span className="step-dot" aria-hidden="true" />
            </div>
            <div className="step-icon" aria-hidden="true">
              {[<MessageCircle key="1" />, <Compass key="2" />, <PenTool key="3" />, <Code2 key="4" />, <ShieldCheck key="5" />, <Rocket key="6" />][i]}
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: 'Starter',
      fit: 'For small businesses & personal portfolios.',
      features: ['Up to 3 pages', 'Fully responsive design', 'Contact enquiry section', 'Basic SEO setup']
    },
    {
      name: 'Business',
      fit: 'For growing businesses & startups.',
      features: ['Up to 7 pages', 'Custom UI/UX design', 'Responsive across all devices', 'Integrated contact form with email', 'Backend integration', 'SEO-friendly structure'],
      featured: true
    },
    {
      name: 'Premium',
      fit: 'For more advanced requirements.',
      features: ['Custom website development', 'Advanced frontend & animations', 'Backend & database integration', 'Authentication, if needed', 'Custom functionality', 'Deployment & handover assistance']
    }
  ];
  return (
    <section className="pricing section-shell" id="pricing" aria-labelledby="pricing-title">
      <div className="pricing-head">
        <SectionHeading kicker="A GOOD PLACE TO START" title={<>Clear scope.<br /><span className="outline-text">A custom quote.</span></>}>
          Every project has its own shape. These packages are starting points for a conversation.
        </SectionHeading>
        <span className="pricing-aside">
          <span className="mini-line" aria-hidden="true" /> No one-size-fits-all pricing.<br />Just a thoughtful fit.
        </span>
      </div>
      <div className="price-grid">
        {plans.map((p, i) => (
          <article className={`price-card ${p.featured ? 'price-featured' : ''}`} key={p.name}>
            <div className="price-top">
              <span>0{i + 1} / PACKAGE</span>
              {p.featured && <span className="popular">RECOMMENDED</span>}
            </div>
            <h3>{p.name}</h3>
            <p>{p.fit}</p>
            <div className="price-placeholder">
              LET’S DISCUSS YOUR SCOPE <ArrowUpRight size={14} aria-hidden="true" />
            </div>
            <div className="price-rule" aria-hidden="true" />
            <span className="includes">A STARTING POINT FOR</span>
            <ul>
              {p.features.map(f => (
                <li key={f}>
                  <Check size={15} aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="price-link" data-plan={p.name}>
              Get a custom quote <ArrowRight size={16} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
      <p className="pricing-note">
        <span aria-hidden="true">↳</span> Final pricing depends on project complexity, features, integrations, and requirements.
      </p>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setLoading(true);
    setStatus(null);
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'We could not send your enquiry. Please try again.');
      setStatus({ type: 'success', message: data.message || 'Thanks — your enquiry was accepted for email delivery.' });
      form.reset();
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message === 'Failed to fetch'
          ? 'We couldn’t reach the enquiry service. Please email us directly.'
          : err.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
      <div className="contact-left">
        <div className="eyebrow"><span className="heading-dash" aria-hidden="true" /> HAVE A PROJECT IN MIND?</div>
        <h2 id="contact-title">Let’s make<br /><span className="outline-text">something matter.</span></h2>
        <p>Tell us what you’re thinking. A few details are all we need to start a useful conversation.</p>
        <div className="contact-lines">
          <a href="mailto:wildcyrus107@gmail.com" aria-label="Send email to wildcyrus107@gmail.com">
            <span><Mail size={17} aria-hidden="true" /></span>
            <div>
              <small>EMAIL</small>
              <b>wildcyrus107@gmail.com</b>
            </div>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="tel:+919898221976" aria-label="Call or WhatsApp +91 98982 21976">
            <span><Phone size={17} aria-hidden="true" /></span>
            <div>
              <small>CALL OR WHATSAPP</small>
              <b>+91 98982 21976</b>
            </div>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a
            href="https://instagram.com/webstack.studio"
            target="_blank"
            rel="noreferrer"
            aria-label="WebStack Studio on Instagram (opens in new tab)"
          >
            <span><Instagram size={17} aria-hidden="true" /></span>
            <div>
              <small>INSTAGRAM</small>
              <b>@webstack.studio</b>
            </div>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="contact-online">
          <span className="pulse-dot" aria-hidden="true" /> ONLINE, WORKING WORLDWIDE
        </div>
      </div>

      <form className="contact-form" onSubmit={submit} aria-label="Project enquiry form">
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="field-website">Leave this field empty</label>
          <input id="field-website" name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="form-heading">
          <span>THE PROJECT BRIEF</span>
          <small>FIELDS MARKED * ARE REQUIRED</small>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="form-name">Full name <span className="req" aria-hidden="true">*</span></label>
            <input
              id="form-name"
              name="name"
              required
              placeholder="Your name"
              autoComplete="name"
              aria-required="true"
            />
          </div>
          <div className="form-field">
            <label htmlFor="form-email">Email address <span className="req" aria-hidden="true">*</span></label>
            <input
              id="form-email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              autoComplete="email"
              inputMode="email"
              aria-required="true"
            />
          </div>
          <div className="form-field">
            <label htmlFor="form-phone">Phone number</label>
            <input
              id="form-phone"
              name="phone"
              type="tel"
              placeholder="+91 00000 00000"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
          <div className="form-field">
            <label htmlFor="form-business">Business name</label>
            <input
              id="form-business"
              name="business"
              placeholder="Your company or brand"
              autoComplete="organization"
            />
          </div>
          <div className="form-field">
            <label htmlFor="form-project-type">Type of project <span className="req" aria-hidden="true">*</span></label>
            <div className="select-wrap">
              <select
                id="form-project-type"
                name="projectType"
                required
                defaultValue=""
                aria-required="true"
              >
                <option value="" disabled>Select a project type</option>
                {['Business Website', 'Portfolio Website', 'E-Commerce Website', 'Full-Stack Web Application', 'Website Redesign', 'API Development', 'Other'].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              <ChevronDown className="select-caret" size={15} aria-hidden="true" />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="form-budget">Estimated budget</label>
            <div className="select-wrap">
              <select id="form-budget" name="budget" defaultValue="">
                <option value="" disabled>Select a range</option>
                {['Below ₹5,000', '₹5,000–₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', 'Above ₹50,000', 'Not Decided'].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              <ChevronDown className="select-caret" size={15} aria-hidden="true" />
            </div>
          </div>
          <div className="form-field form-wide">
            <label htmlFor="form-desc">Project description <span className="req" aria-hidden="true">*</span></label>
            <textarea
              id="form-desc"
              name="description"
              required
              rows="3"
              placeholder="A little about what you’d like to build…"
              aria-required="true"
            />
          </div>
          <div className="form-field form-wide">
            <label htmlFor="form-reqs">Anything else we should know?</label>
            <textarea
              id="form-reqs"
              name="requirements"
              rows="2"
              placeholder="Features, references, timelines—whatever’s on your mind."
            />
          </div>
        </div>

        <div className="form-bottom">
          <p>Your details stay private and are used only to respond to your enquiry.</p>
          <button
            className="button submit-button"
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Sending…' : 'Send your enquiry'}
            {loading ? <span className="spinner" aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}
          </button>
        </div>

        {status && (
          <div
            className={`form-status ${status.type === 'success' ? 'form-success' : 'form-error'}`}
            role={status.type === 'success' ? 'status' : 'alert'}
            aria-live="polite"
          >
            {status.message}
          </div>
        )}
        <div className="form-privacy">
          <ShieldCheck size={14} aria-hidden="true" /> YOUR INFORMATION IS HANDLED WITH CARE
        </div>
      </form>
    </section>
  );
}

function FAQ() {
  const [active, setActive] = useState(0);

  return (
    <section className="faq section-shell" id="faq" aria-labelledby="faq-title">
      <div className="faq-intro">
        <div className="eyebrow"><span className="heading-dash" aria-hidden="true" /> GOOD QUESTIONS</div>
        <h2 id="faq-title">A few things<br /><span className="outline-text">you might be wondering.</span></h2>
        <p>Still curious? We’re happy to talk it through.</p>
        <a href="#contact" className="text-link">Ask us directly <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
      <div className="faq-list">
        {faqs.map(([q, a], i) => (
          <div className={`faq-item ${active === i ? 'faq-active' : ''}`} key={q}>
            <button
              type="button"
              aria-expanded={active === i}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
              onClick={() => setActive(active === i ? -1 : i)}
            >
              <span className="faq-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <b>{q}</b>
              <span className="faq-icon" aria-hidden="true">{active === i ? '−' : '+'}</span>
            </button>
            {active === i && (
              <p id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`}>
                {a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-top section-shell">
        <div className="footer-brand">
          <Logo />
          <p>Building thoughtful websites and digital experiences for businesses worldwide.</p>
          <a
            className="footer-social"
            href="https://instagram.com/webstack.studio"
            target="_blank"
            rel="noreferrer"
            aria-label="WebStack Studio on Instagram (opens in new tab)"
          >
            <Instagram size={16} aria-hidden="true" /> INSTAGRAM <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-col">
          <span>EXPLORE</span>
          {[
            ['Home', '#home'],
            ['About', '#about'],
            ['Services', '#services'],
            ['Projects', '#projects'],
            ['Pricing', '#pricing'],
            ['Contact', '#contact']
          ].map(([n, h]) => (
            <a href={h} key={n}>{n}</a>
          ))}
        </div>
        <div className="footer-col">
          <span>WHAT WE DO</span>
          {[
            'Website development',
            'Full-stack development',
            'E-commerce',
            'UI/UX design',
            'API development',
            'Website maintenance'
          ].map(n => (
            <a href="#services" key={n}>{n}</a>
          ))}
        </div>
        <div className="footer-col footer-contact">
          <span>SAY HELLO</span>
          <a href="mailto:wildcyrus107@gmail.com" aria-label="Email wildcyrus107@gmail.com">
            wildcyrus107@gmail.com
          </a>
          <a href="tel:+919898221976" aria-label="Call +91 98982 21976">
            +91 98982 21976
          </a>
          <a
            href="https://instagram.com/webstack.studio"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram profile @webstack.studio"
          >
            @webstack.studio
          </a>
          <a
            href="https://wa.me/919898221976"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-link"
            aria-label="Chat on WhatsApp (opens in new tab)"
          >
            <MessageCircle size={14} aria-hidden="true" /> Chat on WhatsApp <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="footer-bottom section-shell">
        <span>© 2026 WebStack Studio. All rights reserved.</span>
        <div>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms & conditions</Link>
        </div>
        <a className="back-top" href="#home" aria-label="Back to top of page">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
}

function Legal({ kind }) {
  const privacy = kind === 'Privacy Policy';
  return (
    <main className="legal-page section-shell" id="main-content">
      <Link to="/" className="text-link">← Back to WebStack Studio</Link>
      <div className="eyebrow"><span className="heading-dash" aria-hidden="true" /> WEBSTACK STUDIO</div>
      <h1>{kind}</h1>
      <p className="legal-updated">Last updated: November 13, 2026</p>
      {privacy ? (
        <>
          <h2>Information you share</h2>
          <p>When you submit a project enquiry, we collect the details you provide, such as your name, email address, phone number, business name, project type, budget range, and project description.</p>
          <h2>How we use it</h2>
          <p>We use enquiry information to respond to your request and discuss potential work. We do not sell your personal information.</p>
          <h2>Storage and contact</h2>
          <p>Enquiry data may be stored in our project systems and handled by service providers used to operate this website. To ask about or request deletion of information you have submitted, email <a href="mailto:wildcyrus107@gmail.com">wildcyrus107@gmail.com</a>.</p>
          <h2>Updates</h2>
          <p>We may update this policy as the website or our practices change. The current version will appear on this page.</p>
        </>
      ) : (
        <>
          <h2>Using this website</h2>
          <p>This website provides information about WebStack Studio and a way to enquire about web development services. Please provide accurate details when contacting us.</p>
          <h2>Project work</h2>
          <p>Project scope, deliverables, pricing, timelines, ownership, and support arrangements are agreed individually in writing before work begins. Website examples on this site are labelled concept projects and are illustrative demos.</p>
          <h2>Website content</h2>
          <p>Website content is provided for general information and may change. Contact us to confirm service scope and availability for a particular project.</p>
          <h2>Contact</h2>
          <p>Questions about these terms? Email <a href="mailto:wildcyrus107@gmail.com">wildcyrus107@gmail.com</a>.</p>
        </>
      )}
    </main>
  );
}

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <main id="main-content">
              <Hero />
              <About />
              <Services />
              <Stack />
              <Projects />
              <Why />
              <Process />
              <Pricing />
              <Contact />
              <FAQ />
            </main>
          }
        />
        <Route path="/privacy" element={<Legal kind="Privacy Policy" />} />
        <Route path="/terms" element={<Legal kind="Terms & Conditions" />} />
        <Route
          path="*"
          element={
            <main className="not-found section-shell" id="main-content">
              <div className="eyebrow"><span className="heading-dash" aria-hidden="true" /> 404 / PAGE NOT FOUND</div>
              <h1>Well, this<br /><span className="outline-text">is a dead end.</span></h1>
              <p>Let’s get you back to something good.</p>
              <Button href="/">Back to home</Button>
            </main>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
