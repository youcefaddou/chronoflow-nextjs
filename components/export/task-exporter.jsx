'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import usePlanLimits from '../../hooks/use-plan-limits'
import { PlanLimitModal } from '../common/plan-limit-alert'

const LOGO_BASE64 = 'data:image/png;base64,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';

// Hook pour s'assurer qu'on est côté client
function useIsClient() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return isClient
}

/**
 * Formate une durée en secondes au format hh:mm:ss
 * @param {number} seconds - Durée en secondes
 * @returns {string} Durée formatée
 */
function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00:00'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

/**
 * Exporte des tâches au format CSV
 * @param {Object[]} tasks - Les tâches à exporter
 * @param {string} lang - Langue ('fr' ou 'en')
 * @returns {string} URL de téléchargement
 */
function exportToCsv(tasks, lang) {
    const headers = lang === 'fr'
        ? 'Titre,Description,Durée (s),Durée (hh:mm:ss),Terminé,Date de début,Date de fin\n'
        : 'Title,Description,Duration (s),Duration (hh:mm:ss),Finished,Start Date,End Date\n'
    const csvContent = tasks.map(task => {
        const duration = typeof task.durationSeconds === 'number' ? task.durationSeconds : (task.duration_seconds ?? 0)
        return [
            `"${task.title || ''}"`,
            `"${task.description || ''}"`,
            duration,
            formatDuration(duration),
            task.isFinished ? (lang === 'fr' ? 'Oui' : 'Yes') : (lang === 'fr' ? 'Non' : 'No'),
            task.start ? new Date(task.start).toLocaleString() : '',
            task.end ? new Date(task.end).toLocaleString() : '',
        ].join(',')
    }).join('\n')
    const fullCsv = headers + csvContent
    const blob = new Blob([fullCsv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const filename = tasks.length === 1
        ? `${tasks[0].title || 'task'}.csv`
        : 'tasks-export.csv'
    triggerDownload(url, filename)
    return url
}

/**
 * Ajoute le logo Chronoflow au document PDF
 * @param {jsPDF} doc - Document PDF
 */
function addLogo(doc) {
    try {
        // Vérifier qu'on est côté client
        if (typeof window === 'undefined') {
            return
        }

        // Essayer d'abord avec le logo local
        const logoWidth = 55
        const logoHeight = 15
        doc.addImage(LOGO_BASE64, 'PNG', 4, 10, logoWidth, logoHeight)
    } catch (error) {
        console.warn('Impossible d\'ajouter le logo:', error)
    }
}

/**
 * Exporte des tâches au format PDF
 * @param {Object[]} tasks - Les tâches à exporter
 * @param {string} lang - Langue ('fr' ou 'en')
 * @returns {string} URL de téléchargement
 */
function exportToPdf(tasks, lang) {
    const doc = new jsPDF()

    // Ajouter le logo avec les dimensions ajustées
    addLogo(doc)

    // Titre du document - déplacé vers la droite pour laisser place au logo
    doc.setFontSize(18)
    doc.setTextColor(40, 99, 175) // bleu
    doc.text(lang === 'fr' ? 'Rapport de tâches' : 'Task Report', 80, 22)

    // Information de date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(new Date().toLocaleString(), 80, 30)

    // Tableau des tâches
    const headers = [
        lang === 'fr' ? 'Titre' : 'Title',
        lang === 'fr' ? 'Durée' : 'Duration',
        lang === 'fr' ? 'Terminé' : 'Finished',
        lang === 'fr' ? 'Date de début' : 'Start Date',
    ]

    const data = tasks.map(task => {
        const duration = typeof task.durationSeconds === 'number' ? task.durationSeconds : (task.duration_seconds ?? 0)
        return [
            task.title || '',
            formatDuration(duration),
            task.isFinished ? 'YES' : 'NO',
            task.start ? new Date(task.start).toLocaleDateString() : '-',
        ]
    })

    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 35,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 133, 244], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
    })

    // Résumé
    const totalDuration = tasks.reduce((sum, task) => sum + (typeof task.durationSeconds === 'number' ? task.durationSeconds : (task.duration_seconds ?? 0)), 0)
    const completedTasks = tasks.filter(task => task.isFinished).length

    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    // Utilisez la dernière position de tableau depuis l'objet retourné
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 50
    doc.text(lang === 'fr' ? 'Résumé' : 'Summary', 14, finalY + 15)

    doc.setFontSize(10)
    doc.text(lang === 'fr' ? `Nombre total de tâches: ${tasks.length}` : `Total tasks: ${tasks.length}`, 14, finalY + 25)
    doc.text(lang === 'fr' ? `Tâches terminées: ${completedTasks}` : `Completed tasks: ${completedTasks}`, 14, finalY + 32)
    doc.text(lang === 'fr' ? `Temps total passé: ${formatDuration(totalDuration)}` : `Total time spent: ${formatDuration(totalDuration)}`, 14, finalY + 39)

    // Générer et télécharger le PDF
    const blob = doc.output('blob')
    const url = URL.createObjectURL(blob)

    const filename = tasks.length === 1
        ? `${tasks[0].title || 'task'}.pdf`
        : 'tasks-report.pdf'

    triggerDownload(url, filename)

    return url
}

/**
 * Exporte un rapport de productivité complet
 * @param {Object[]} tasks - Les tâches à exporter
 * @param {string} lang - Langue ('fr' ou 'en')
 * @param {Object} user - Informations sur l'utilisateur
 * @returns {string} URL de téléchargement
 */
async function exportProductivityReport(tasks, lang, user) {
    const doc = new jsPDF()
    addLogo(doc)

    // Placement du titre et des sous-titres sans chevauchement
    doc.setFontSize(24)
    doc.setTextColor(40, 99, 175)
    doc.text(
        lang === 'fr' ? 'Rapport de productivité' : 'Productivity Report',
        doc.internal.pageSize.getWidth() / 2,
        22,
        { align: 'center' }
    )
    doc.setFontSize(12)
    doc.setTextColor(80, 80, 80)
    doc.text(
        lang === 'fr' ? `Généré pour: ${user?.email || user?.name || 'Utilisateur'}` : `Generated for: ${user?.email || user?.name || 'User'}`,
        doc.internal.pageSize.getWidth() / 2,
        32,
        { align: 'center' }
    )
    doc.text(new Date().toLocaleDateString(), doc.internal.pageSize.getWidth() / 5, 39, { align: 'center' })

    // Extraction des durées et dates
    const durations = tasks.map(task => (typeof task.durationSeconds === 'number' ? task.durationSeconds : (task.duration_seconds ?? 0)))
    const totalDuration = durations.reduce((sum, d) => sum + d, 0)
    const avgDuration = durations.length ? Math.round(totalDuration / durations.length) : 0
    const maxDuration = durations.length ? Math.max(...durations) : 0
    const minDuration = durations.length ? Math.min(...durations) : 0
    const completedTasks = tasks.filter(task => task.isFinished).length
    const pendingTasks = tasks.length - completedTasks
    const completionRate = tasks.length > 0 ? (completedTasks / tasks.length * 100).toFixed(1) : 0

    // Regroupement par période (auto : jour, semaine, ou mois selon l'étendue et le nombre de barres)
    const parseDate = d => d ? new Date(d) : null
    const allDates = tasks.map(t => parseDate(t.start)).filter(Boolean).sort((a, b) => a - b)
    let periodType = 'day'
    if (allDates.length > 1) {
        const first = allDates[0], last = allDates[allDates.length - 1]
        const diffDays = (last - first) / (1000 * 60 * 60 * 24)
        // Générer les périodes par jour pour compter le nombre de barres
        const dayLabels = []
        for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
            dayLabels.push(d.toISOString().slice(0, 10))
        }
        if (dayLabels.length > 30) {
            // Trop de jours, on passe à la semaine
            periodType = 'week'
            // Compter le nombre de semaines
            const weekLabels = []
            let d = new Date(first)
            d.setDate(d.getDate() - d.getDay())
            while (d <= last) {
                weekLabels.push(`${d.getFullYear()}-W${String(getWeekNumber(d)).padStart(2, '0')}`)
                d.setDate(d.getDate() + 7)
            }
            if (weekLabels.length > 18) {
                // Encore trop, on passe au mois
                periodType = 'month'
            }
        }
    }
    function getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
        const dayNum = d.getUTCDay() || 7
        d.setUTCDate(d.getUTCDate() + 4 - dayNum)
        const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 1))
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    }
    // Correction de la clé de regroupement pour garantir une addition correcte par période
    // Correction : regrouper par date locale (getFullYear, getMonth, getDate)
    const formatPeriod = date => {
        if (!date) return '-'
        const d = new Date(date)
        if (periodType === 'month') {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        }
        if (periodType === 'week') {
            return `${d.getFullYear()}-W${String(getWeekNumber(d)).padStart(2, '0')}`
        }
        // Par défaut, jour au format YYYY-MM-DD (locale)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
    const periodMap = {}
    tasks.forEach(task => {
        const period = formatPeriod(task.start)
        const duration = typeof task.durationSeconds === 'number' ? task.durationSeconds : (task.duration_seconds ?? 0)
        if (!periodMap[period]) periodMap[period] = 0
        periodMap[period] += duration
    })
    // Générer toutes les périodes entre la première et la dernière date, même vides
    let fullPeriodLabels = []
    if (allDates.length > 0) {
        const first = allDates[0]
        const last = allDates[allDates.length - 1]
        if (periodType === 'day') {
            let d = new Date(first)
            while (d <= last) {
                fullPeriodLabels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
                d.setDate(d.getDate() + 1)
            }
        } else if (periodType === 'week') {
            let d = new Date(first)
            d.setDate(d.getDate() - d.getDay())
            while (d <= last) {
                fullPeriodLabels.push(`${d.getFullYear()}-W${String(getWeekNumber(d)).padStart(2, '0')}`)
                d.setDate(d.getDate() + 7)
            }
        } else if (periodType === 'month') {
            let d = new Date(first.getFullYear(), first.getMonth(), 1)
            while (d <= last) {
                fullPeriodLabels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
                d.setMonth(d.getMonth() + 1)
            }
        }
    }
    // Remplir les périodes vides à zéro
    const periodLabels = fullPeriodLabels.length ? fullPeriodLabels : Object.keys(periodMap)
    const periodDurations = periodLabels.map(label => (periodMap[label] || 0))

    // Statistiques générales avancées
    doc.setFontSize(18)
    doc.setTextColor(40, 99, 175)
    doc.text(lang === 'fr' ? 'Statistiques générales' : 'General Statistics', 14, 49)
    const statsHeaders = [[
        lang === 'fr' ? 'Métrique' : 'Metric',
        lang === 'fr' ? 'Valeur' : 'Value',
    ]]
    const statsData = [
        [lang === 'fr' ? 'Nombre total de tâches' : 'Total tasks', tasks.length.toString()],
        [lang === 'fr' ? 'Tâches terminées' : 'Completed tasks', completedTasks.toString()],
        [lang === 'fr' ? 'Tâches en cours' : 'Pending tasks', pendingTasks.toString()],
        [lang === 'fr' ? 'Taux de complétion' : 'Completion rate', `${completionRate}%`],
        [lang === 'fr' ? 'Temps total travaillé' : 'Total time worked', formatDuration(totalDuration)],
        [lang === 'fr' ? 'Durée moyenne' : 'Average duration', formatDuration(avgDuration)],
        [lang === 'fr' ? 'Durée max' : 'Max duration', formatDuration(maxDuration)],
        [lang === 'fr' ? 'Durée min' : 'Min duration', formatDuration(minDuration)],
    ]

    autoTable(doc, {
        head: statsHeaders,
        body: statsData,
        startY: 55,
        styles: { fontSize: 11 },
        headStyles: { fillColor: [66, 133, 244], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
    })

    // Positionner le graphique juste après le tableau de stats
    const afterStatsY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 100	// Calcul dynamique de l'axe Y du graphique (max = total max par période, sans arrondi, sans x2)
    const maxPeriodTotal = Math.max(...periodLabels.map(label => periodMap[label] || 0), 1)
    let chartImage = null
    try {
        // Vérifier qu'on est côté client
        if (typeof window === 'undefined') {
            console.warn('Chart.js nécessite un environnement browser')
            return url
        }

        // Import dynamique de Chart.js pour éviter les problèmes côté serveur
        const { Chart } = await import('chart.js/auto')

        const chartCanvas = document.createElement('canvas')
        chartCanvas.width = 400
        chartCanvas.height = 250
        chartCanvas.style.padding = '0'
        const chartContext = chartCanvas.getContext('2d')
        // Nouvelle logique : axe Y strictement de 0 à max, ticks uniquement 0 et max, aucune division
        const chart = new Chart(chartContext, {
            type: 'bar',
            data: {
                labels: periodLabels,
                datasets: [{
                    label: lang === 'fr' ? 'Temps passé (s)' : 'Time spent (s)',
                    data: periodDurations,
                    backgroundColor: '#4285F4',
                    barPercentage: 1,
                    categoryPercentage: 1,
                    borderRadius: 0,
                    borderSkipped: false,
                    borderWidth: 0,
                    clip: false,
                }],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                layout: { padding: 0 },
                scales: {
                    y: {
                        type: 'linear',
                        beginAtZero: true,
                        min: 0,
                        max: maxPeriodTotal,
                        grace: 0,
                        offset: false,
                        ticks: {
                            stepSize: maxPeriodTotal / 4,
                            callback: v => formatDuration(v),
                            count: 5,
                            padding: 0,
                        },
                        grid: { drawBorder: true, drawTicks: true, drawOnChartArea: true },
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Arial',
                                size: 12,
                                weight: 'normal',
                            },
                        },
                    },
                },
                plugins: {
                    legend: { display: false },
                },
                animation: false,
                layout: { padding: 0 },
                // Ajoute ceci pour la police :
                font: {
                    family: 'Arial',
                    size: 12,
                    weight: 'normal',
                    lineHeight: 1.2,
                },
            },
        })
        await new Promise(r => setTimeout(r, 150))
        chartImage = chartCanvas.toDataURL('image/png')

        // Nettoie le chart pour éviter les fuites mémoire
        chart.destroy()
    } catch (err) {
        console.error('Graphique non généré (canvas non dispo)', err)
    }
    // Titre du graphique
    const chartTitle = lang === 'fr' ? 'Évolution du temps total par période' : 'Total Time Spent per Period'
    if (chartImage) {
        doc.setFontSize(15)
        doc.setTextColor(40, 99, 175)
        doc.text(chartTitle, 14, afterStatsY + 8)
        doc.addImage(chartImage, 'PNG', 14, afterStatsY + 14, 180, 72) // Ratio fidèle à la hauteur du canvas
    }

    // Décaler la section Détails des tâches plus bas (décalage +30px)
    const afterChartY = afterStatsY + 104
    doc.setFontSize(18)
    doc.setTextColor(40, 99, 175)
    doc.text(lang === 'fr' ? 'Détails des tâches' : 'Task Details', 14, afterChartY)
    const taskHeaders = [
        lang === 'fr' ? 'Titre' : 'Title',
        lang === 'fr' ? 'Durée' : 'Duration',
        lang === 'fr' ? 'Statut' : 'Status',
        lang === 'fr' ? 'Créé le' : 'Created',
    ]
    const taskData = tasks.map(task => {
        const duration = typeof task.durationSeconds === 'number' ? task.durationSeconds : (task.duration_seconds ?? 0)
        return [
            task.title || '',
            formatDuration(duration),
            task.isFinished
                ? (lang === 'fr' ? 'Terminé' : 'Completed')
                : (lang === 'fr' ? 'En cours' : 'In progress'),
            task.start ? new Date(task.start).toLocaleDateString() : '-',
        ]
    })

    autoTable(doc, {
        head: [taskHeaders],
        body: taskData,
        startY: afterChartY + 5,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 133, 244], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 14, right: 14 },
    })

    const blob = doc.output('blob')
    const url = URL.createObjectURL(blob)
    const filename = 'productivity-report.pdf'
    triggerDownload(url, filename)
    return url
}

/**
 * Déclenche le téléchargement d'un fichier
 * @param {string} url - URL du blob à télécharger
 * @param {string} filename - Nom du fichier
 */
function triggerDownload(url, filename) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Exporte une tâche ou un ensemble de tâches dans différents formats
 * @param {Object} options - Options d'exportation
 * @param {Object|Object[]} options.tasks - La tâche ou les tâches à exporter
 * @param {string} options.format - Format d'exportation ('csv', 'pdf', 'productivity-report')
 * @param {string} options.lang - Langue ('fr' ou 'en')
 * @param {Object} options.user - Informations sur l'utilisateur
 * @returns {Promise<string|Blob>} URL de téléchargement ou blob
 */
export async function exportTask({ tasks, format = 'csv', lang = 'fr', user }) {
    // Si on a une seule tâche, la convertir en tableau
    const tasksArray = Array.isArray(tasks) ? tasks : [tasks]

    let result
    switch (format) {
        case 'csv':
            result = exportToCsv(tasksArray, lang)
            break

        case 'pdf':
            result = exportToPdf(tasksArray, lang)
            break

        case 'productivity-report':
            result = exportProductivityReport(tasksArray, lang, user)
            break

        default:
            throw new Error(`Format d'exportation non supporté: ${format}`)
    }

    // Enregistrer l'export côté serveur pour les limitations
    if (user && user.id) {
        try {
            const response = await fetch('/api/record-export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: format,
                }),
            })

            if (!response.ok) {
                console.warn('Erreur lors de l\'enregistrement de l\'export:', response.statusText)
            }
        } catch (error) {
            console.warn('Erreur lors de l\'enregistrement de l\'export:', error)
            // Ne pas faire échouer l'export si l'enregistrement échoue
        }
    }

    return result
}

/**
 * Composant modal d'exportation avancée
 */
function TaskExporterModal({ isOpen, onClose, tasks = [], user, lang = 'fr' }) {
    const [format, setFormat] = useState('pdf')
    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState(null)
    const [showLimitModal, setShowLimitModal] = useState(false)
    const isClient = useIsClient()
    const { t } = useTranslation()
    const { canExport, getLimitMessage, updateStats } = usePlanLimits()

    const tasksCount = tasks?.length || 0

    if (!isClient) return null

    const handleExport = async () => {
        // Vérifier la limite d'export
        if (!canExport()) {
            setShowLimitModal(true)
            return
        }

        setIsExporting(true)
        setError(null)
        try {
            const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
                import('jspdf'),
                import('jspdf-autotable'),
            ])
            if (format === 'productivity-report') {
                await import('chart.js/auto')
            }
            window.jsPDF = jsPDF
            window.autoTable = autoTable

            await exportTask({
                tasks,
                format,
                lang,
                user,
            })
            
            // Mettre à jour les statistiques d'export
            updateStats('exportsThisMonth', true)
            
            setTimeout(() => {
                setIsExporting(false)
                onClose()
            }, 500)
        } catch (err) {
            console.error('Erreur export:', err)
            setError(err.message || 'Erreur lors de l\'exportation')
            setIsExporting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                    {t('export.title')}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    {t('export.tasksCount', { count: tasksCount })}
                </p>
                {error && (
                    <div className="text-red-600 text-sm mb-2">{error}</div>
                )}

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">
                        {t('export.format')}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        <label className="flex items-center p-3 border rounded hover:bg-blue-50 cursor-pointer">
                            <input
                                type="radio"
                                name="format"
                                value="csv"
                                checked={format === 'csv'}
                                onChange={() => setFormat('csv')}
                                className="mr-2"
                            />                            <div>
                                <div className="font-medium text-gray-900">{t('export.csv')}</div>
                                <div className="text-sm text-gray-500">
                                    {t('export.csvDesc')}
                                </div>
                            </div>
                        </label>

                        <label className="flex items-center p-3 border rounded hover:bg-blue-50 cursor-pointer">
                            <input
                                type="radio"
                                name="format"
                                value="pdf"
                                checked={format === 'pdf'}
                                onChange={() => setFormat('pdf')}
                                className="mr-2"
                            />                            <div>
                                <div className="font-medium text-gray-900">{t('export.pdf')}</div>
                                <div className="text-sm text-gray-500">
                                    {t('export.pdfDesc')}
                                </div>
                            </div>
                        </label>

                        <label className="flex items-center p-3 border rounded hover:bg-blue-50 cursor-pointer">
                            <input
                                type="radio"
                                name="format"
                                value="productivity-report"
                                checked={format === 'productivity-report'}
                                onChange={() => setFormat('productivity-report')}
                                className="mr-2"
                            />                            <div>
                                <div className="font-medium text-gray-900">
                                    {t('export.report')}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {t('export.reportDesc')}
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        {t('export.cancel')}
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isExporting ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                {t('export.exporting')}
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 12V4M8 12L5 9M8 12L11 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 15H13C14.1046 15 15 14.1046 15 13V3C15 1.89543 14.1046 1 13 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15Z" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                {t('export.export')}
                            </>
                        )}
                    </button>                </div>
            </div>
            
            {/* Modal de limitation */}
            <PlanLimitModal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                type="exports"
                title={t('limits.exports.maxReached') || 'Limite d\'exports atteinte'}
                message={getLimitMessage('exports')}
            />
        </div>
    )
}

export default TaskExporterModal
