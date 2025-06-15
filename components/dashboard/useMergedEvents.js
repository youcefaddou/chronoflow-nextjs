import { useState, useEffect } from 'react'

/**
 * Custom hook to merge Google Calendar events and local tasks
 * @param {Object} user - User object
 * @param {number} refreshKey - Key to trigger refresh
 * @returns {Object} { events, loading, error, refetch }
 */
function useMergedEvents(user, refreshKey = 0) {
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchEvents = async () => {
		if (!user) {
			setEvents([])
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError(null)

			// Fetch local tasks
			const tasksResponse = await fetch('/api/tasks', {
				credentials: 'include',
			})
			const localTasks = tasksResponse.ok ? await tasksResponse.json() : []

			// Fetch Google Calendar events
			const googleResponse = await fetch('/api/integrations/google-calendar/events', {
				credentials: 'include',
			})
			const googleEvents = googleResponse.ok ? await googleResponse.json() : []

			// Transform and merge events
			const transformedLocalTasks = localTasks.map(task => ({
				...task,
				id: task.id || task._id,
				isGoogle: false,
				start: new Date(task.start),
				end: new Date(task.end),
			}))

			const transformedGoogleEvents = googleEvents.map(event => ({
				...event,
				id: `gcal-${event.id}`,
				isGoogle: true,
				start: new Date(event.start?.dateTime || event.start?.date),
				end: new Date(event.end?.dateTime || event.end?.date),
				title: event.summary || 'Untitled Event',
				description: event.description || '',
			}))

			const mergedEvents = [...transformedLocalTasks, ...transformedGoogleEvents]
			setEvents(mergedEvents)
		} catch (err) {
			console.error('Error fetching events:', err)
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchEvents()
	}, [user, refreshKey])

	return {
		events,
		loading,
		error,
		refetch: fetchEvents,
	}
}

export default useMergedEvents