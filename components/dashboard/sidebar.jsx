'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { 
	Home, 
	Settings, 
	Users, 
	CreditCard,
	ChevronLeft,
	ChevronRight,
	Timer
} from 'lucide-react'
import Link from 'next/link'

export default function Sidebar({ isMobileOpen, onMobileClose, user }) {
	const { t } = useTranslation()
	const pathname = usePathname()
	const router = useRouter()

	const [isHovered, setIsHovered] = useState(false)
	const [collapsed, setCollapsed] = useState(true)
	const [isMobile, setIsMobile] = useState(false)

	// Check if mobile and force collapse on route change
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		
		checkMobile()
		window.addEventListener('resize', checkMobile)
		
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	// Force collapse on route change and close mobile menu
	useEffect(() => {
		setCollapsed(true)
		if (isMobile && onMobileClose) {
			onMobileClose()
		}
	}, [pathname, isMobile, onMobileClose])

	// Close sidebar on mobile when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isMobile && isMobileOpen && !event.target.closest('aside') && !event.target.closest('button[aria-label*="menu"]')) {
				onMobileClose?.()
			}
		}

		if (isMobile && isMobileOpen) {
			document.addEventListener('click', handleClickOutside)
			return () => document.removeEventListener('click', handleClickOutside)
		}
	}, [isMobile, isMobileOpen, onMobileClose])

	const isCollapsed = collapsed && !isHovered

	// Handle mobile menu toggle
	const handleToggle = () => {
		setCollapsed(!collapsed)
	}
	// Navigation items
	const navigationItems = [
		{
			name: t('sidebar.dashboard') || 'Dashboard',
			href: '/dashboard',
			icon: Home,
			current: pathname === '/dashboard'
		}
	]

	const settingsItems = [
		{
			name: t('sidebar.subscription') || 'Subscription',
			href: '/dashboard/subscription',
			icon: CreditCard,
			current: pathname.startsWith('/dashboard/subscription')
		},
		{
			name: t('sidebar.organization') || 'Organization',
			href: '/dashboard/organization',
			icon: Users,
			current: pathname.startsWith('/dashboard/organization')
		},
		{
			name: t('sidebar.settings') || 'Settings',
			href: '/dashboard/settings',
			icon: Settings,
			current: pathname.startsWith('/dashboard/settings')
		}
	]

	// User is passed as prop, no need to extract from session
	// const user = session?.user
	return (
		<>
			{/* Mobile overlay */}
			{isMobile && isMobileOpen && (
				<div 
					className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
					onClick={() => onMobileClose?.()}
				/>
			)}			{/* Sidebar */}			<aside
				className={`
					${isMobile ? 'fixed' : 'relative'} left-0 top-0 z-50 bg-gray-900 text-white
					transition-all duration-300 ease-in-out
					${isCollapsed ? 'w-16' : 'w-64'}
					${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}
					flex flex-col
					${isMobile ? 'h-screen' : 'min-h-screen'}
				`}
				onMouseEnter={() => !isMobile && setIsHovered(true)}
				onMouseLeave={() => !isMobile && setIsHovered(false)}
			>				{/* Header */}
				<div className="h-16 flex items-center justify-between px-4">
					<div className={`
						flex items-center gap-3 transition-all duration-300 ease-in-out
						${isCollapsed ? 'justify-center' : 'justify-start'}
					`}>
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
							<Timer className="w-5 h-5 text-white" />
						</div>
						<span className={`
							font-bold text-lg transition-all duration-300 ease-in-out
							${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
						`}>
							ChronoFlow
						</span>
					</div>					{/* Toggle button */}
					<button
						onClick={handleToggle}
						className={`
							p-1.5 rounded-md hover:bg-gray-700 transition-all duration-300 ease-in-out
							${isCollapsed && !isMobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
						`}
					>
						{collapsed ? (
							<ChevronRight className="w-4 h-4" />
						) : (
							<ChevronLeft className="w-4 h-4" />
						)}
					</button>
				</div>				{/* User section */}
				{user && (
					<div className={`
						p-4 transition-all duration-300 ease-in-out
						${isCollapsed ? 'px-2' : 'px-4'}
					`}>
						<div className={`
							flex items-center gap-3 transition-all duration-300 ease-in-out
							${isCollapsed ? 'justify-center' : 'justify-start'}
						`}>
							<div className={`
								rounded-full bg-gradient-to-br from-blue-500 to-blue-300 
								flex items-center justify-center text-white font-bold shadow-md
								transition-all duration-300 ease-in-out
								${isCollapsed ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg'}
							`}>
								{user.email?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || 'U'}
							</div>
							<div className={`
								flex flex-col transition-all duration-300 ease-in-out
								${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
							`}>
								<span className="text-sm font-medium text-white truncate max-w-[180px]">
									{user.name || user.email}
								</span>
								{user.name && user.email && (
									<span className="text-xs text-gray-300 truncate max-w-[180px]">
										{user.email}
									</span>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto py-4">					{/* Main navigation */}
					<div className="px-2 mb-6">
						{!isCollapsed && (
							<div className="mb-2 transition-all duration-300 ease-in-out">
								<span className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
									{t('sidebar.navigation') || 'Navigation'}
								</span>
							</div>
						)}
						<ul className="space-y-1">{navigationItems.map((item) => {
								const Icon = item.icon
								return (
									<li key={item.name}>
										<Link
											href={item.href}
											className={`
												group flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md
												transition-all duration-200 ease-in-out relative
												${item.current 
													? 'bg-blue-600 text-white shadow-md' 
													: 'text-gray-300 hover:bg-gray-800 hover:text-white'
												}
												${isCollapsed ? 'justify-center' : 'justify-start'}
											`}
											title={isCollapsed ? item.name : undefined}
										>
											<Icon className={`
												flex-shrink-0 transition-all duration-200 ease-in-out
												${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}
												${item.current ? 'text-white' : 'text-gray-400 group-hover:text-white'}
											`} />
											<span className={`
												transition-all duration-300 ease-in-out
												${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
											`}>
												{item.name}
											</span>
											
											{/* Tooltip for collapsed state */}
											{isCollapsed && (
												<div className="
													absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded
													opacity-0 group-hover:opacity-100 transition-opacity duration-200
													pointer-events-none whitespace-nowrap z-50
												">
													{item.name}
												</div>
											)}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>					{/* Settings section */}
					<div className="px-2">
						{!isCollapsed && (
							<div className="mb-2 transition-all duration-300 ease-in-out">
								<span className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
									{t('sidebar.account') || 'Account'}
								</span>
							</div>
						)}
						<ul className="space-y-1">{settingsItems.map((item) => {
								const Icon = item.icon
								return (
									<li key={item.name}>
										<Link
											href={item.href}
											className={`
												group flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md
												transition-all duration-200 ease-in-out relative
												${item.current 
													? 'bg-blue-600 text-white shadow-md' 
													: 'text-gray-300 hover:bg-gray-800 hover:text-white'
												}
												${isCollapsed ? 'justify-center' : 'justify-start'}
											`}
											title={isCollapsed ? item.name : undefined}
										>
											<Icon className={`
												flex-shrink-0 transition-all duration-200 ease-in-out
												${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}
												${item.current ? 'text-white' : 'text-gray-400 group-hover:text-white'}
											`} />
											<span className={`
												transition-all duration-300 ease-in-out
												${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
											`}>
												{item.name}
											</span>
											
											{/* Tooltip for collapsed state */}
											{isCollapsed && (
												<div className="
													absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded
													opacity-0 group-hover:opacity-100 transition-opacity duration-200
													pointer-events-none whitespace-nowrap z-50
												">
													{item.name}
												</div>
											)}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>
				</nav>				{/* Footer */}
				<div className="p-4">
					<div className={`
						text-center transition-all duration-300 ease-in-out
						${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}
					`}>
						<p className="text-xs text-gray-400">
							© 2024 ChronoFlow
						</p>
					</div>
				</div>
			</aside>
		</>
	)
}
