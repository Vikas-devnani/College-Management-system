import React from 'react'

export default class ErrorBoundary extends React.Component{
  constructor(props){ super(props); this.state={hasError:false, error:null} }
  static getDerivedStateFromError(error){ return { hasError:true, error } }
  componentDidCatch(err, info){ console.error(err, info) }
  render(){ if (this.state.hasError) return (<div className="p-6 bg-red-50 rounded"> <h3 className="text-red-700">Something went wrong</h3><pre className="text-sm">{String(this.state.error)}</pre></div>); return this.props.children }
}
