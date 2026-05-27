import { Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Today } from './pages/Today'
import { Progress } from './pages/Progress'
import { Program } from './pages/Program'
import { Benchmarks } from './pages/Benchmarks'
import { useAppStore } from './store'

export default function App() {
  const store = useAppStore()

  const todayActions = {
    startWorkout: store.startWorkout,
    completeSection: store.completeSection,
    logSet: store.logSet,
    finishWorkout: store.finishWorkout,
    setCurrentWorkout: store.setCurrentWorkout,
    startRestTimer: store.startRestTimer,
    clearRestTimer: store.clearRestTimer,
  }

  const progressActions = {
    updateWendlerTMs: store.updateWendlerTMs,
    updateDBBench: store.updateDBBench,
    addMafEntry: store.addMafEntry,
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/"           element={<Today      state={store.state} actions={todayActions} />} />
        <Route path="/progress"   element={<Progress   state={store.state} actions={progressActions} />} />
        <Route path="/program"    element={<Program    state={store.state} />} />
        <Route path="/benchmarks" element={<Benchmarks state={store.state} actions={{ addBenchmark: store.addBenchmark }} />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
