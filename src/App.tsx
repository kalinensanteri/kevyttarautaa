import { Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Today } from './pages/Today'
import { Progress } from './pages/Progress'
import { Program } from './pages/Program'
import { Nutrition } from './pages/Nutrition'
import { useAppStore } from './store'

export default function App() {
  const { state, actions } = useAppStore()

  return (
    <div className="min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <Today
              state={state}
              actions={{
                setViewDate:      actions.setViewDate,
                completeSession:  actions.completeSession,
                logExerciseSet:   actions.logExerciseSet,
                logSessionRun:    actions.logSessionRun,
                logMetconResult:  actions.logMetconResult,
                startRestTimer:   actions.startRestTimer,
                clearRestTimer:   actions.clearRestTimer,
              }}
            />
          }
        />
        <Route
          path="/progress"
          element={
            <Progress
              state={state}
              actions={{
                addBodyWeight:  actions.addBodyWeight,
                addRunEntry:    actions.addRunEntry,
                addMetconEntry: actions.addMetconEntry,
              }}
            />
          }
        />
        <Route
          path="/program"
          element={
            <Program
              state={state}
              actions={{
                setPhase: actions.setPhase,
              }}
            />
          }
        />
        <Route path="/fuel" element={<Nutrition />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
