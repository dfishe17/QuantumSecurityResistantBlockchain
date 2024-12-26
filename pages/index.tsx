import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useToast } from '../components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { BlockchainVisualization } from '../components/BlockchainVisualization'

interface Block {
  index: number
  transactions: Transaction[]
  timestamp: number
  previous_hash: string
  hash: string
}

interface Transaction {
  sender: string
  recipient: string
  amount: number
  timestamp: number
}

const API_BASE_URL = typeof window !== 'undefined'
  ? `https://${window.location.hostname.replace('3000', '8080')}`
  : 'http://localhost:8080'

const transactionSchema = z.object({
  recipient: z.string().min(1, "Recipient address is required"),
  amount: z.preprocess(
    (a) => Number(a),
    z.number().positive("Amount must be positive")
  )
})

type TransactionFormData = z.infer<typeof transactionSchema>

function logError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context
  })
}

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [mining, setMining] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema)
  })

  const fetchBlocks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chain`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (!Array.isArray(data?.chain)) {
        throw new Error('Invalid response format')
      }
      setBlocks(data.chain)
    } catch (error) {
      logError(error, 'fetchBlocks')
      toast({
        title: "Error",
        description: "Failed to fetch blockchain data. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMining = async () => {
    setMining(true)
    try {
      const response = await fetch(`${API_BASE_URL}/mine`)
      if (!response.ok) {
        throw new Error(`Mining failed with status: ${response.status}`)
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: data.message || "New block mined successfully!",
      })
      await fetchBlocks()
    } catch (error) {
      logError(error, 'handleMining')
      toast({
        title: "Error",
        description: "Mining failed. Please try again.",
        variant: "destructive"
      })
    } finally {
      setMining(false)
    }
  }

  const onSubmitTransaction = async (data: TransactionFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: data.recipient,
          amount: Number(data.amount)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Transaction failed with status: ${response.status}`)
      }

      const responseData = await response.json()
      toast({
        title: "Success",
        description: responseData.message || "Transaction created successfully!",
      })
      reset()
      await fetchBlocks()
    } catch (error) {
      logError(error, 'onSubmitTransaction')
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create transaction",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    let isActive = true
    let intervalId: NodeJS.Timeout

    const initializeBlockchain = async () => {
      if (!isActive) return
      await fetchBlocks()

      intervalId = setInterval(async () => {
        if (isActive) {
          await fetchBlocks().catch(error => {
            logError(error, 'blockchainPolling')
          })
        }
      }, 10000)
    }

    initializeBlockchain().catch(error => {
      logError(error, 'initializeBlockchain')
    })

    return () => {
      isActive = false
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Quantum-Resistant Blockchain
            </CardTitle>
            <p className="mt-2 text-gray-300">
              Secure blockchain implementation with post-quantum cryptography
            </p>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Create Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmitTransaction)} className="space-y-4">
                <div>
                  <Input
                    placeholder="Recipient Address"
                    {...register('recipient')}
                    className="bg-gray-700/50 border-gray-600"
                  />
                  {errors.recipient && (
                    <p className="text-red-400 text-sm mt-1">{errors.recipient.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    {...register('amount')}
                    className="bg-gray-700/50 border-gray-600"
                  />
                  {errors.amount && (
                    <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Create Transaction
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Mining Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleMining} 
                disabled={mining}
                className="w-full"
              >
                {mining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mining ? 'Mining...' : 'Mine New Block'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Blockchain Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <BlockchainVisualization blocks={blocks} />
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle>Quantum-Resistant Algorithms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/algorithms/kyber" className="block">
                <Card className="bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">Kyber</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      A lattice-based key encapsulation mechanism resistant to quantum attacks.
                    </p>
                    <div className="text-purple-300 text-sm">
                      Key Features:
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                        <li>Post-quantum security</li>
                        <li>Efficient implementation</li>
                        <li>Small key sizes</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/algorithms/dilithium" className="block">
                <Card className="bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">Dilithium</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      A lattice-based digital signature scheme for secure transactions.
                    </p>
                    <div className="text-purple-300 text-sm">
                      Key Features:
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                        <li>Strong security guarantees</li>
                        <li>Fast signature verification</li>
                        <li>Quantum resistance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/algorithms/rainbow" className="block">
                <Card className="bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">Rainbow</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      A multivariate public key cryptographic system for signatures.
                    </p>
                    <div className="text-purple-300 text-sm">
                      Key Features:
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                        <li>Multivariate polynomials</li>
                        <li>Fast verification</li>
                        <li>Compact signatures</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/algorithms/ntru" className="block">
                <Card className="bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">NTRU</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      A lattice-based public key cryptosystem for encryption.
                    </p>
                    <div className="text-purple-300 text-sm">
                      Key Features:
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                        <li>Efficient encryption</li>
                        <li>Compact key sizes</li>
                        <li>Patent-free status</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}