import { AlgorithmLayout } from '../../components/layouts/AlgorithmLayout'
import { Card, CardContent } from '../../components/ui/card'

export default function RainbowPage() {
  return (
    <AlgorithmLayout
      title="Rainbow"
      description="A multivariate public key signature scheme resistant to quantum attacks"
    >
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Overview</h3>
          <p className="text-gray-300 leading-relaxed">
            Rainbow is a multivariate polynomial-based signature scheme that offers an alternative 
            approach to post-quantum cryptography. Unlike lattice-based schemes, it relies on 
            the difficulty of solving systems of multivariate polynomial equations.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Key Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Fast signature verification</li>
                <li>• Small signature size</li>
                <li>• Based on Oil-Vinegar structure</li>
                <li>• Quantum-resistant security</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Technical Details</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Multivariate polynomial system</li>
                <li>• Layer-based structure</li>
                <li>• Modified Oil-Vinegar scheme</li>
                <li>• Optimized key generation</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Implementation Example</h3>
          <div className="bg-gray-900/50 p-6 rounded-lg font-mono text-sm">
            <pre className="text-gray-300">
              <code>{`
# Example Rainbow usage in our blockchain
rainbow = generate_rainbow_keypair()
message = b"Data to be signed"
signature = rainbow.sign(message)

# Verify the signature
is_valid = rainbow.verify(message, signature)
assert is_valid == True
              `}</code>
            </pre>
          </div>
        </section>
      </div>
    </AlgorithmLayout>
  )
}
