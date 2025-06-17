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
	X,
	Puzzle
} from 'lucide-react'
import Link from 'next/link'

export default function Sidebar({ isMobileOpen, onMobileClose, onMobileToggle, user }) {
	const { t } = useTranslation()
	const pathname = usePathname()
	const router = useRouter()

	const [isHovered, setIsHovered] = useState(false)
	const [collapsed, setCollapsed] = useState(true)
	const [isMobile, setIsMobile] = useState(false)

	// Check if mobile and force collapse on route change
	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 768
			setIsMobile(mobile)
			if (mobile) {
				setCollapsed(false) // Sur mobile, on ne collapse jamais la sidebar quand elle est ouverte
			}
		}
		
		checkMobile()
		window.addEventListener('resize', checkMobile)
		
		return () => window.removeEventListener('resize', checkMobile)
	}, [])
	// Force collapse on route change and close mobile menu
	useEffect(() => {
		if (!isMobile) {
			setCollapsed(true)
		}
		if (isMobile && onMobileClose) {
			onMobileClose()
		}
	}, [pathname, isMobile, onMobileClose])

	const handleToggle = () => {
		if (isMobile) {
			onMobileToggle()
		} else {
			setCollapsed(!collapsed)
		}
	}
	const isCollapsed = !isMobile && collapsed && !isHovered
	// Navigation items sans Calendar et Timer
	const navigationItems = [
		{
			name: t('sidebar.dashboard') || 'Tableau de bord',
			href: '/dashboard',
			icon: Home,
			current: pathname === '/dashboard'
		},
		{
			name: t('sidebar.integrations') || 'Intégrations',
			href: '/dashboard/integrations',
			icon: Puzzle,
			current: pathname.startsWith('/dashboard/integrations')
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
		},		{
			name: t('sidebar.settings') || 'Paramètres',
			href: '/dashboard/settings',
			icon: Settings,
			current: pathname.startsWith('/dashboard/settings')
		}
	]

	// User is passed as prop, no need to extract from session
	// const user = session?.user	
	return (
		<>
			{/* Sidebar */}					
			<aside
				className={`
					dashboard-sidebar
					${isMobile ? 'fixed' : 'relative'} left-0 top-0 z-50 bg-gray-900 text-white
					transition-all duration-300 ease-in-out
					${isMobile ? 'w-64' : (isCollapsed ? 'w-16' : 'w-64')}
					${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}
					flex flex-col
					${isMobile ? 'h-screen' : 'min-h-screen'}
					overflow-x-hidden
					max-w-64
				`}
				onMouseEnter={() => !isMobile && setIsHovered(true)}
				onMouseLeave={() => !isMobile && setIsHovered(false)}
			>				{/* Header */}
				<div className="h-16 flex items-center justify-between overflow-hidden px-2">					
					<div className={`
						flex items-center transition-all duration-300 ease-in-out min-w-0
						${isCollapsed ? 'justify-center px-1' : 'justify-start'}
					`}>
						<Home className="w-5 h-5 text-blue-400 flex-shrink-0" />
						<span className={`
							ml-3 font-bold text-lg transition-all duration-300 ease-in-out
							${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
							truncate
						`}>
							ChronoFlow
						</span>
					</div>
					{/* Toggle button ou Close button sur mobile */}
					{isMobile ? (
						<button
							onClick={onMobileClose}
							className="p-1.5 rounded-md hover:bg-gray-700 transition-colors duration-200 flex-shrink-0 mr-1"
							aria-label="Close sidebar"
						>
							<X className="w-5 h-5" />
						</button>
					) : (
						<button
							onClick={handleToggle}
							className={`
								p-1.5 rounded-md hover:bg-gray-700 transition-all duration-300 ease-in-out flex-shrink-0
								${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 mr-1'}
							`}
							aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						>
							{collapsed ? (
								<ChevronRight className="w-4 h-4" />
							) : (
								<ChevronLeft className="w-4 h-4" />
							)}
						</button>
					)}
				</div>
				
				{/* User section */}
				{user && (
					<div className={`
						p-4 transition-all duration-300 ease-in-out overflow-hidden
						${isCollapsed ? 'px-2' : 'px-4'}
					`}>
						<div className={`
							flex items-center transition-all duration-300 ease-in-out min-w-0
							${isCollapsed ? 'justify-center' : 'justify-start'}
						`}>
							<div className={`
								rounded-full bg-gradient-to-br from-blue-500 to-blue-300 
								flex items-center justify-center text-white font-bold shadow-md flex-shrink-0
								transition-all duration-300 ease-in-out
								${isCollapsed ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg'}
							`}>
								{user.email?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || 'U'}
							</div>
							<div className={`
								flex flex-col transition-all duration-300 ml-3 ease-in-out min-w-0
								${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
							`}>
								<span className="text-sm font-medium text-white truncate">
									{user.name || user.email}
								</span>
								{user.name && user.email && (
									<span className="text-xs text-gray-300 truncate">
										{user.email}
									</span>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto py-4 overflow-x-hidden">					
					{/* Main navigation */}
					<div className="px-2 mb-6">
						{!isCollapsed && (
							<div className="mb-2 transition-all duration-300 ease-in-out">
								<span className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
									{t('sidebar.navigation') || 'Navigation'}
								</span>
							</div>
						)}						<ul className="space-y-1">
							{navigationItems.map((item) => {
								const Icon = item.icon
								return (
									<li key={item.name} className="sidebar-nav-item">
										<Link
											href={item.href}
											className={`
												group flex items-center text-sm font-medium rounded-md
												transition-all duration-200 ease-in-out relative min-w-0
												${item.current 
													? 'bg-blue-600 text-white shadow-md' 
													: 'text-gray-300 hover:bg-gray-800 hover:text-white'
												}
												${isCollapsed ? 'justify-center px-3 py-3' : 'justify-start px-2 py-2'}
											`}
											title={isCollapsed ? item.name : undefined}
										>
											<Icon className={`
												flex-shrink-0 transition-all duration-200 ease-in-out w-5 h-5
												${item.current ? 'text-white' : 'text-gray-400 group-hover:text-white'}
											`} />
											<span className={`
												transition-all duration-300 ease-in-out sidebar-text
												${isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 ml-3'}
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
					{/* Settings section */}
					<div className="px-2">
						{!isCollapsed && (
							<div className="mb-2 transition-all duration-300 ease-in-out">
								<span className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
									{t('sidebar.account') || 'Account'}
								</span>
							</div>
						)}						<ul className="space-y-1">
							{settingsItems.map((item) => {
								const Icon = item.icon
								return (
									<li key={item.name} className="sidebar-nav-item">
										<Link
											href={item.href}
											className={`
												group flex items-center text-sm font-medium rounded-md
												transition-all duration-200 ease-in-out relative min-w-0
												${item.current 
													? 'bg-blue-600 text-white shadow-md' 
													: 'text-gray-300 hover:bg-gray-800 hover:text-white'
												}
												${isCollapsed ? 'justify-center px-3 py-3' : 'justify-start px-2 py-2'}
											`}
											title={isCollapsed ? item.name : undefined}
										>
											<Icon className={`
												flex-shrink-0 transition-all duration-200 ease-in-out w-5 h-5
												${item.current ? 'text-white' : 'text-gray-400 group-hover:text-white'}
											`} />
											<span className={`
												transition-all duration-300 ease-in-out sidebar-text
												${isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 ml-3'}
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
				</nav>
				
				{/* Footer */}
				<div className="p-4 overflow-hidden">
					<div className={`
						text-center transition-all duration-300 ease-in-out
						${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}
					`}>
						<p className="text-xs text-gray-400 truncate">
							© 2024 ChronoFlow
						</p>
					</div>
				</div>
			</aside>
		</>	)
}
