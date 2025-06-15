"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/auth-context'
import "./header.css"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const pathname = usePathname()
  const navRef = useRef()
  const { user, loading } = useAuth()

  const currentLang = i18n.language || 'fr'
  const showFlag = currentLang === "fr" ? "/assets/eng.png" : "/assets/france.png"
  const nextLang = currentLang === "fr" ? "en" : "fr"

  const navLinks = [
    { href: "/product", label: t("header.product") },
    { href: "/pricing", label: t("header.pricing") },
    { href: "/ressources", label: t("header.resources") },
  ]
  const handleLangSwitch = () => {
    const newLang = nextLang;
    i18n.changeLanguage(newLang);
    
    // Update URL with language parameter to make it shareable
    const url = new URL(window.location);
    url.searchParams.set('lang', newLang);
    window.history.replaceState({}, '', url);
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [menuOpen])
  const handleLogin = () => {
    window.location.href = '/login'
  }
  const handleSignup = () => {
    window.location.href = '/signup'
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      if (res.ok) {
        window.location.href = '/'
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    }
  }

  return (
    <header className="header-sticky" aria-label="Barre de navigation principale">
      <nav className="header-nav" ref={navRef}>
        <div className="header-logo-title">          <Link href="/">
            <Image 
              src="/assets/logo.png" 
              alt="Logo ChronoFlow" 
              className="header-logo" 
              width={180} 
              height={38} 
              priority
            />
          </Link>
        </div>
        <button
          className="header-burger"
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="header-burger-bar"></span>
          <span className="header-burger-bar"></span>
          <span className="header-burger-bar"></span>
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <ul
            className={`header-links ${menuOpen ? "header-links-open" : ""}`}
            aria-label="Liens de navigation"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`header-link${pathname === link.href ? " header-link-active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>            ))}            
            {/* Boutons d'authentification conditionnels */}
            <li className="header-login-row">
              {user ? (
                // Utilisateur connecté - Afficher le bouton de déconnexion
                <>
                  <Link href="/dashboard" className="header-btn header-btn-secondary">
                    {t("header.dashboard")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="header-btn header-btn-main"
                  >
                    {t("header.logout")}
                  </button>
                </>
              ) : (
                // Utilisateur non connecté - Afficher les boutons de connexion/inscription
                <>
                  <button
                    onClick={handleSignup}
                    className="header-btn header-btn-secondary"
                  >
                    {t("header.signup")}
                  </button>
                  <button
                    onClick={handleLogin}
                    className="header-btn header-btn-main"
                  >
                    {t("header.login")}
                  </button>
                </>
              )}
            </li>
          </ul>
          <button
            onClick={handleLangSwitch}
            className="header-lang-btn"
            aria-label={nextLang === "fr" ? "Français" : "English"}
          >
            <Image src={showFlag} alt={nextLang} className="header-flag" width={22} height={16} />
          </button>
        </div>
      </nav>
    </header>
  )
}
