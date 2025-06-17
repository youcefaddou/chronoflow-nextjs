'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Play,
    Pause,
    Square,
    Clock,
    Calendar,
    BarChart3,
    Settings,
    ChevronRight,
    Plus
} from 'lucide-react'

// Hook pour animer les chiffres
function useCountUp(end, duration = 2000, start = 0) {
    const [count, setCount] = useState(start)
    const countRef = useRef(start)
    const frameRef = useRef()

    useEffect(() => {
        const startTime = Date.now()
        const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)

            // Easing function pour un effet smooth
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const current = start + (end - start) * easeOutQuart

            countRef.current = current
            setCount(current)

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate)
            }
        }

        frameRef.current = requestAnimationFrame(animate)

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current)
            }
        }
    }, [end, duration, start])

    return Math.floor(count)
}

// Timer formatté
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Dashboard ChronoFlow pour Freelances
function FreelanceChronoFlowDashboard() {
    const [currentTime, setCurrentTime] = useState(8542) // 2h 22m 22s
    const [isRunning, setIsRunning] = useState(true)
    const [currentTask, setCurrentTask] = useState(0)
    const [activeView, setActiveView] = useState(0)
    const views = ['Timer', 'Tâches']
    const tasks = [
        'Développement Site Client',
        'Révision Branding',
        'Call Client Prospect'
    ]

    // Animation du timer qui s'incrémente
    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => {
            setCurrentTime(prev => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [isRunning])

    // Change de tâche toutes les 4 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTask(prev => (prev + 1) % tasks.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    // Switch entre les vues toutes les 5 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveView(prev => (prev + 1) % views.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="h-64 bg-white rounded-lg shadow-lg p-4 relative overflow-hidden border border-gray-200">
            {/* Header Dashboard */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">ChronoFlow Freelance</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-4">
                {views.map((view, index) => (
                    <div
                        key={view}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors duration-300 ${activeView === index
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {view}
                    </div>
                ))}
            </div>

            {/* Contenu selon la vue active */}
            <div className="h-32">
                {activeView === 0 && (
                    /* Vue Timer */
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 h-full">
                        <div className="text-center">
                            <div className="text-xl font-mono font-bold text-gray-800 mb-2">
                                {formatTime(currentTime)}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                {tasks[currentTask]}
                            </div>

                            {/* Contrôles Timer */}
                            <div className="flex items-center justify-center space-x-2 mb-3">
                                <button
                                    onClick={() => setIsRunning(!isRunning)}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                >
                                    {isRunning ?
                                        <Pause className="w-3 h-3 text-white" /> :
                                        <Play className="w-3 h-3 text-white ml-0.5" />
                                    }
                                </button>
                                <button className="w-6 h-6 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                                    <Square className="w-2 h-2 text-white" />
                                </button>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <div className="font-semibold text-blue-600">8h</div>
                                    <div className="text-gray-500">Aujourd'hui</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-green-600">3</div>
                                    <div className="text-gray-500">Projets</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-purple-600">92%</div>
                                    <div className="text-gray-500">Focus</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 1 && (
                    /* Vue Tâches */
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                            <span>Mes Projets</span>
                            <span className="text-blue-600">3 actifs</span>
                        </div>
                        {[
                            { name: 'Site E-commerce Client A', time: '2h 15m', status: 'En cours', rate: '€50/h', priority: 'high' },
                            { name: 'Logo & Branding Startup', time: '1h 30m', status: 'Révision', rate: '€45/h', priority: 'medium' },
                            { name: 'Consultation Marketing', time: '45m', status: 'Terminé', rate: '€60/h', priority: 'high' },
                            { name: 'Formation React Client', time: '30m', status: 'Planifié', rate: '€40/h', priority: 'low' }
                        ].map((task, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${task.status === 'En cours' ? 'bg-blue-500' :
                                            task.status === 'Révision' ? 'bg-orange-500' :
                                                task.status === 'Terminé' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-800">{task.name}</div>
                                        <div className="text-xs text-gray-500">{task.time} • {task.rate}</div>
                                    </div>
                                </div>
                                <div className={`w-1 h-6 rounded-full ${task.priority === 'high' ? 'bg-red-400' :
                                        task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300'
                                    }`}></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// Dashboard ChronoFlow pour PME
function PMEChronoFlowDashboard() {
    const [activeView, setActiveView] = useState(0)
    const views = ['Timer', 'Tâches']

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveView(prev => (prev + 1) % views.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="h-64 bg-white rounded-lg shadow-lg p-4 relative overflow-hidden border border-gray-200">
            {/* Header avec Navigation */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">ChronoFlow PME</span>
                </div>
                <Plus className="w-4 h-4 text-gray-400" />
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-4">
                {views.map((view, index) => (
                    <div
                        key={view}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors duration-300 ${activeView === index
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {view}
                    </div>
                ))}
            </div>

            {/* Contenu selon la vue active */}
            <div className="h-32">
                {activeView === 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 h-full">
                        <div className="text-center">
                            <div className="text-xl font-mono font-bold text-gray-800 mb-2">
                                02:15:30
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                Développement App Mobile
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <div className="font-semibold text-green-600">8</div>
                                    <div className="text-gray-500">Membres actifs</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-blue-600">156h</div>
                                    <div className="text-gray-500">Total semaine</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 1 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                            <span>Liste des Tâches</span>
                            <span className="text-green-600">5 actives</span>
                        </div>
                        {[
                            { name: 'Révision UI/UX Dashboard', time: '1h 30m', status: 'En cours', priority: 'high' },
                            { name: 'Tests API Authentification', time: '45m', status: 'Terminé', priority: 'medium' },
                            { name: 'Réunion Client Hebdo', time: '30m', status: 'À venir', priority: 'high' },
                            { name: 'Documentation Technique', time: '2h', status: 'En cours', priority: 'low' }
                        ].map((task, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${task.status === 'En cours' ? 'bg-blue-500' :
                                            task.status === 'Terminé' ? 'bg-green-500' : 'bg-orange-500'
                                        }`}></div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-800">{task.name}</div>
                                        <div className="text-xs text-gray-500">{task.time} • {task.status}</div>
                                    </div>
                                </div>
                                <div className={`w-1 h-6 rounded-full ${task.priority === 'high' ? 'bg-red-400' :
                                        task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300'
                                    }`}></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// Composant principal qui switch entre les deux dashboards
export default function InteractiveMockup({ activeTab }) {
    return (
        <div className="relative">
            <div className="transition-all duration-500 ease-in-out">
                {activeTab === 'freelances' ? <FreelanceChronoFlowDashboard /> : <PMEChronoFlowDashboard />}
            </div>
        </div>
    )
}
