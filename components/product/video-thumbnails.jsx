// Composants pour générer des thumbnails SVG attractifs
import { Clock, Calendar, BarChart3, Play } from 'lucide-react'

export function ChronoThumbnail() {
    return (
        <svg width="400" height="225" viewBox="0 0 400 225" className="w-full h-full">
            {/* Background Gradient */}
            <defs>
                <linearGradient id="chronoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#1E40AF', stopOpacity:1}} />
                </linearGradient>
                <linearGradient id="chronoOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'rgba(255,255,255,0.1)', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'rgba(255,255,255,0.0)', stopOpacity:1}} />
                </linearGradient>
            </defs>
            
            <rect width="400" height="225" fill="url(#chronoGrad)" />
            <rect width="400" height="225" fill="url(#chronoOverlay)" />
            
            {/* Decorative circles */}
            <circle cx="350" cy="50" r="30" fill="rgba(255,255,255,0.1)" />
            <circle cx="50" cy="175" r="20" fill="rgba(255,255,255,0.15)" />
            <circle cx="300" cy="180" r="15" fill="rgba(255,255,255,0.1)" />
            
            {/* Main Timer Display */}
            <rect x="100" y="60" width="200" height="80" rx="15" fill="rgba(255,255,255,0.9)" />
            <text x="200" y="110" textAnchor="middle" className="fill-blue-600 font-mono text-2xl font-bold">25:42</text>
            
            {/* Clock Icon */}
            <g transform="translate(170, 25)">
                <circle r="20" fill="rgba(255,255,255,0.2)" />
                <Clock className="w-8 h-8 text-white" style={{transform: 'translate(-16px, -16px)'}} />
            </g>
            
            {/* Focus Mode Indicator */}
            <rect x="150" y="160" width="100" height="30" rx="15" fill="rgba(255,255,255,0.2)" />
            <text x="200" y="180" textAnchor="middle" className="fill-white text-sm font-semibold">MODE FOCUS</text>
            
            {/* Play Button Overlay */}
            <circle cx="200" cy="112" r="25" fill="rgba(0,0,0,0.7)" />
            <polygon points="192,105 192,119 208,112" fill="white" />
        </svg>
    )
}

export function CalendarThumbnail() {
    return (
        <svg width="400" height="225" viewBox="0 0 400 225" className="w-full h-full">
            <defs>
                <linearGradient id="calendarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#10B981', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#059669', stopOpacity:1}} />
                </linearGradient>
            </defs>
            
            <rect width="400" height="225" fill="url(#calendarGrad)" />
            
            {/* Calendar Grid */}
            <rect x="80" y="40" width="240" height="140" rx="10" fill="rgba(255,255,255,0.95)" />
            
            {/* Calendar Header */}
            <rect x="80" y="40" width="240" height="30" rx="10" fill="rgba(255,255,255,1)" />
            <text x="200" y="60" textAnchor="middle" className="fill-green-600 text-sm font-bold">NOVEMBRE 2024</text>
            
            {/* Calendar Days */}
            {[...Array(5)].map((_, row) => 
                [...Array(7)].map((_, col) => (
                    <rect 
                        key={`${row}-${col}`}
                        x={90 + col * 30} 
                        y={80 + row * 20} 
                        width="25" 
                        height="15" 
                        rx="2" 
                        fill={row === 2 && col === 3 ? "#10B981" : "rgba(16,185,129,0.1)"} 
                    />
                ))
            )}
            
            {/* Google Calendar Icon */}
            <circle cx="120" cy="200" r="15" fill="rgba(255,255,255,0.2)" />
            <Calendar className="w-6 h-6 text-white" style={{transform: 'translate(108px, 188px)'}} />
            
            {/* Sync Arrow */}
            <path d="M 250 190 Q 280 180 300 200" stroke="rgba(255,255,255,0.8)" strokeWidth="3" fill="none" />
            <polygon points="295,195 305,200 295,205" fill="rgba(255,255,255,0.8)" />
            
            {/* Play Button */}
            <circle cx="200" cy="112" r="25" fill="rgba(0,0,0,0.7)" />
            <polygon points="192,105 192,119 208,112" fill="white" />
        </svg>
    )
}

export function ReportsThumbnail() {
    return (
        <svg width="400" height="225" viewBox="0 0 400 225" className="w-full h-full">
            <defs>
                <linearGradient id="reportsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#7C3AED', stopOpacity:1}} />
                </linearGradient>
            </defs>
            
            <rect width="400" height="225" fill="url(#reportsGrad)" />
            
            {/* Chart Background */}
            <rect x="60" y="40" width="280" height="140" rx="10" fill="rgba(255,255,255,0.95)" />
            
            {/* Bar Chart */}
            {[60, 80, 45, 95, 70, 85, 55].map((height, index) => (
                <rect 
                    key={index}
                    x={80 + index * 35} 
                    y={180 - height} 
                    width="25" 
                    height={height} 
                    rx="2" 
                    fill="#8B5CF6" 
                    opacity={0.8}
                />
            ))}
            
            {/* Chart Icon */}
            <circle cx="320" cy="60" r="15" fill="rgba(255,255,255,0.2)" />
            <BarChart3 className="w-6 h-6 text-white" style={{transform: 'translate(308px, 48px)'}} />
            
            {/* Statistics */}
            <text x="200" y="210" textAnchor="middle" className="fill-white text-sm font-semibold">+60% PRODUCTIVITÉ</text>
            
            {/* Play Button */}
            <circle cx="200" cy="112" r="25" fill="rgba(0,0,0,0.7)" />
            <polygon points="192,105 192,119 208,112" fill="white" />
        </svg>
    )
}
