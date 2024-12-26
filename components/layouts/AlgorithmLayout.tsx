import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'

interface AlgorithmLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export const AlgorithmLayout: React.FC<AlgorithmLayoutProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-8">
          <Link 
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Blockchain Explorer
          </Link>
        </nav>
        
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {title}
            </CardTitle>
            <p className="text-gray-300 mt-2">{description}</p>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
