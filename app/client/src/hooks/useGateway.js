import { useContext } from 'react'
import { GatewayContext } from '../context/GatewayContext'

export function useGateway() {
  const ctx = useContext(GatewayContext)
  if (!ctx) {
    throw new Error('useGateway must be used within a GatewayProvider')
  }
  return ctx
}

export function useGatewayStatus() {
  const { status, isConnected, isConnecting } = useGateway()
  return { status, isConnected, isConnecting }
}
